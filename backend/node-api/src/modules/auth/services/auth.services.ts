// ─────────────────────────────────────────────────────────────────
//  modules/auth/services/auth.services.js
//  Login, register, token management
// ─────────────────────────────────────────────────────────────────

const db     = require('../../../shared/dbconnection');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  });
}

exports.register = async ({ username, email, password, full_name }) => {
  const password_hash = await bcrypt.hash(password, 12);
  const { rows } = await db.query(
    `INSERT INTO auth.accounts (username, email, password_hash, full_name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, full_name, role, created_at`,
    [username, email, password_hash, full_name]
  );
  return rows[0];
};

exports.login = async ({ email, password }) => {
  // 1. Find account
  const { rows: accRows } = await db.query(
    `SELECT * FROM auth.accounts
     WHERE email = $1 AND is_active = true AND is_deleted = false`,
    [email]
  );
  const account = accRows[0];
  if (!account) throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });

  // 2. Verify password
  const valid = await bcrypt.compare(password, account.password_hash);
  if (!valid) throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });

  // 3. Get default user profile (relationship_type = 'self') for this account
  //    user_id is included in JWT so all modules can filter by user
  const { rows: userRows } = await db.query(
    `SELECT id FROM auth.users
     WHERE account_id = $1 AND relationship_type = 'self'
       AND is_active = true AND is_deleted = false
     ORDER BY created_at ASC LIMIT 1`,
    [account.id]
  );
  const defaultUserId = userRows[0]?.id || null;

  // 4. Build JWT payload — includes both account_id and user_id
  const payload = {
    account_id: account.id,
    user_id:    defaultUserId,
    role:       account.role,
  };

  const accessToken  = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // 5. Store session
  await db.query(
    `INSERT INTO auth.account_sessions (account_id, refresh_token, is_active)
     VALUES ($1, $2, true)`,
    [account.id, refreshToken]
  );

  // 6. Update last login
  await db.query(
    `UPDATE auth.accounts SET last_login_at = NOW() WHERE id = $1`,
    [account.id]
  );

  return {
    access_token:  accessToken,
    refresh_token: refreshToken,
    account: {
      id:       account.id,
      email:    account.email,
      username: account.username,
      role:     account.role,
      user_id:  defaultUserId,
    },
  };
};

exports.logout = async (account_id) => {
  await db.query(
    `UPDATE auth.account_sessions SET is_active = false WHERE account_id = $1`,
    [account_id]
  );
};

exports.refreshToken = async (refresh_token) => {
  const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);

  const { rows } = await db.query(
    `SELECT * FROM auth.account_sessions
     WHERE account_id = $1 AND refresh_token = $2 AND is_active = true`,
    [decoded.account_id, refresh_token]
  );
  if (!rows.length) throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401 });

  const accessToken = generateAccessToken({
    account_id: decoded.account_id,
    user_id:    decoded.user_id,
    role:       decoded.role,
  });
  return { access_token: accessToken };
};

exports.getAccountById = async (account_id) => {
  const { rows } = await db.query(
    `SELECT id, username, email, full_name, role, is_email_verified, last_login_at, created_at
     FROM auth.accounts WHERE id = $1`,
    [account_id]
  );
  return rows[0];
};
