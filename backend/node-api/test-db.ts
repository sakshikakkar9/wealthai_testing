// ─────────────────────────────────────────────────────────────────
//  src/test-db.ts  —  One-shot DB connection tester
//  Compiles to: dist/test-db.js
//  Run after build: node dist/test-db.js
// ─────────────────────────────────────────────────────────────────

import { Pool } from 'pg';
import type { PoolClient } from 'pg';;

const DATABASE_URL = process.env.DATABASE_URL || '';

if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL is not set in environment variables.');
  console.error('    On Render → Dashboard → Environment → add DATABASE_URL');
  process.exit(1);
}

console.log('🔍  DATABASE_URL found:', DATABASE_URL.replace(/:([^@]+)@/, ':***@'));

const pool = new Pool({
  connectionString:        DATABASE_URL,
  ssl:                     { rejectUnauthorized: false },
  connectionTimeoutMillis: 8000,
});

async function runTests(): Promise<void> {
  let client: PoolClient | null = null;

  try {
    console.log('\n⏳  Connecting to Neon DB...\n');
    client = await pool.connect();
    console.log('✅  Connected!\n');

    // Test 1
    const t1 = await client.query('SELECT 1 AS ping');
    console.log('✅  Test 1 — Ping:', t1.rows[0]);

    // Test 2
    const t2 = await client.query(`
      SELECT
        current_database() AS database,
        current_user       AS user,
        now()              AS server_time
    `);
    console.log('✅  Test 2 — DB Info:');
    console.log('   Database    :', t2.rows[0].database);
    console.log('   User        :', t2.rows[0].user);
    console.log('   Server time :', t2.rows[0].server_time);

    // Test 3
    const t3 = await client.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog','information_schema')
      ORDER BY table_schema, table_name
    `);
    console.log('\n✅  Test 3 — Tables:');
    if (t3.rows.length === 0) {
      console.log('   (no tables yet — DB is empty, connection is fine ✅)');
    } else {
      t3.rows.forEach((r: any) => console.log(`   - ${r.table_schema}.${r.table_name}`));
    }

    console.log('\n🎉  All tests passed! Neon DB connection is working.\n');

  } catch (err: any) {
    console.error('\n❌  Connection failed:', err.message);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

runTests();