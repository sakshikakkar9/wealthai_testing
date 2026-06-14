// ─────────────────────────────────────────────────────────────────
//  src/test-server.ts  —  Standalone TS test server
//  This compiles to dist/test-server.js
//  On Render start command: node dist/test-server.js
// ─────────────────────────────────────────────────────────────────

import http, { IncomingMessage, ServerResponse } from 'http';
import { Pool, PoolClient } from 'pg';

const PORT         = process.env.PORT         || 3000;
const DATABASE_URL = process.env.DATABASE_URL || '';

// ── DB Pool ───────────────────────────────────────────────────────
interface DbStatus {
  connected:           boolean;
  error:               string | null;
  testedAt:            string | null;
}

const dbStatus: DbStatus = { connected: false, error: null, testedAt: null };
let pool: Pool | null    = null;

if (DATABASE_URL) {
  pool = new Pool({
    connectionString:        DATABASE_URL,
    ssl:                     { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
    max:                     3,
  });

  pool.connect()
    .then((client: PoolClient) => {
      dbStatus.connected = true;
      dbStatus.testedAt  = new Date().toISOString();
      dbStatus.error     = null;
      client.release();
      console.log('✅  Neon DB connected successfully');
    })
    .catch((err: Error) => {
      dbStatus.connected = false;
      dbStatus.error     = err.message;
      dbStatus.testedAt  = new Date().toISOString();
      console.error('❌  Neon DB connection failed:', err.message);
    });
} else {
  dbStatus.error = 'DATABASE_URL environment variable is not set';
  console.error('❌ ', dbStatus.error);
}

// ── Helpers ───────────────────────────────────────────────────────
function sendJSON(res: ServerResponse, statusCode: number, data: object): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

function getHint(message: string): string {
  if (message.includes('password'))       return 'Wrong password in DATABASE_URL';
  if (message.includes('ENOTFOUND'))      return 'Cannot reach Neon host — check your DATABASE_URL hostname';
  if (message.includes('ETIMEDOUT'))      return 'Connection timed out — Neon DB may be paused';
  if (message.includes('SSL'))            return 'SSL error — make sure ?sslmode=require is in your DATABASE_URL';
  if (message.includes('does not exist')) return 'Database name wrong — check DATABASE_URL';
  return 'Check your DATABASE_URL value in Render → Environment settings';
}

// ── Route handlers ────────────────────────────────────────────────
type Handler = (req: IncomingMessage, res: ServerResponse) => Promise<void> | void;

const routes: Record<string, Handler> = {

  'GET /': (_req, res) => {
    sendJSON(res, 200, {
      service:          'WealthAI Test Server',
      status:           'running',
      timestamp:        new Date().toISOString(),
      env:              process.env.NODE_ENV || 'not set',
      database_url_set: !!DATABASE_URL,
    });
  },

  'GET /health': (_req, res) => {
    sendJSON(res, 200, {
      status:    'ok',
      uptime_s:  Math.floor(process.uptime()),
      memory_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
      timestamp: new Date().toISOString(),
    });
  },

  'GET /db-status': (_req, res) => {
    sendJSON(res, dbStatus.connected ? 200 : 503, {
      ...dbStatus,
      database_url_set:     !!DATABASE_URL,
      database_url_preview: DATABASE_URL
        ? DATABASE_URL.replace(/:([^@]+)@/, ':***@')
        : null,
    });
  },

  'GET /db-test': async (_req, res) => {
    if (!pool) {
      return sendJSON(res, 503, {
        success: false,
        error:   'DATABASE_URL not set — add it in Render → Environment',
      });
    }

    let client: PoolClient | null = null;
    try {
      client = await pool.connect();

      const info = await client.query(`
        SELECT
          current_database() AS database,
          current_user       AS db_user,
          now()              AS server_time
      `);

      const tables = await client.query(`
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_schema NOT IN ('pg_catalog','information_schema')
        ORDER BY table_schema, table_name
      `);

      sendJSON(res, 200, {
        success:     true,
        connected:   true,
        db_info:     info.rows[0],
        tables:      tables.rows,
        table_count: tables.rows.length,
        message:     tables.rows.length === 0
          ? 'DB is empty — connection works fine, no tables yet'
          : `Connected — found ${tables.rows.length} table(s)`,
      });

    } catch (err: any) {
      sendJSON(res, 503, {
        success:   false,
        connected: false,
        error:     err.message,
        hint:      getHint(err.message),
      });
    } finally {
      if (client) client.release();
    }
  },

  'GET /env-check': (_req, res) => {
    const keys = ['NODE_ENV', 'PORT', 'DATABASE_URL', 'JWT_SECRET', 'ALLOWED_ORIGINS'];
    const result: Record<string, string> = {};
    keys.forEach(k => {
      result[k] = process.env[k] ? '✅ set' : '❌ missing';
    });
    sendJSON(res, 200, { env_vars: result });
  },

};

// ── Server ────────────────────────────────────────────────────────
const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const url     = req.url?.split('?')[0] || '/';
  const key     = `${req.method} ${url}`;
  const handler = routes[key];

  if (handler) {
    try {
      await handler(req, res);
    } catch (err: any) {
      sendJSON(res, 500, { error: err.message });
    }
  } else {
    sendJSON(res, 404, {
      error:            `Route not found: ${key}`,
      available_routes: Object.keys(routes),
    });
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀  WealthAI test server running on port ${PORT}`);
  console.log(`\n   Test these URLs:`);
  console.log(`   → /            basic info`);
  console.log(`   → /health      uptime & memory`);
  console.log(`   → /db-status   DB connection status from startup`);
  console.log(`   → /db-test     live DB query  ← most important`);
  console.log(`   → /env-check   which env vars are set\n`);
});