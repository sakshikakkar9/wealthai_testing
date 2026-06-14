// ─────────────────────────────────────────────────────────────────
//  modules/auth/services/profile.services.js
//  User profiles and broker account DB queries
// ─────────────────────────────────────────────────────────────────

const db = require('../../../shared/dbconnection');

// ── User Profiles ─────────────────────────────────────────────────

exports.addUser = async ({ account_id, profile_name, relationship_type, full_name, email, mobile_number, pan_number, dob }) => {
  const { rows } = await db.query(
    `INSERT INTO auth.users
       (account_id, profile_name, relationship_type, full_name, email, mobile_number, pan_number, dob)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [account_id, profile_name, relationship_type || 'self', full_name, email, mobile_number, pan_number, dob]
  );
  return rows[0];
};

exports.getUsersByAccount = async (account_id) => {
  const { rows } = await db.query(
    `SELECT id, profile_name, relationship_type, full_name, email,
            mobile_number, pan_number, dob, is_active, created_at
     FROM auth.users
     WHERE account_id = $1 AND is_deleted = false
     ORDER BY created_at ASC`,
    [account_id]
  );
  return rows;
};

exports.updateUser = async (id, { profile_name, full_name, email, mobile_number, pan_number, dob, relationship_type }) => {
  const { rows } = await db.query(
    `UPDATE auth.users SET
       profile_name      = COALESCE($1, profile_name),
       full_name         = COALESCE($2, full_name),
       email             = COALESCE($3, email),
       mobile_number     = COALESCE($4, mobile_number),
       pan_number        = COALESCE($5, pan_number),
       dob               = COALESCE($6, dob),
       relationship_type = COALESCE($7, relationship_type),
       updated_at        = NOW()
     WHERE id = $8 AND is_deleted = false
     RETURNING *`,
    [profile_name, full_name, email, mobile_number, pan_number, dob, relationship_type, id]
  );
  return rows[0];
};

exports.deleteUser = async (id) => {
  await db.query(
    `UPDATE auth.users SET is_deleted = true, updated_at = NOW() WHERE id = $1`,
    [id]
  );
};

// ── Broker Accounts ───────────────────────────────────────────────

exports.addBroker = async ({ user_id, broker_name, account_number, nickname, is_primary }) => {
  const { rows } = await db.query(
    `INSERT INTO auth.user_brokers (user_id, broker_name, account_number, nickname, is_primary)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [user_id, broker_name, account_number, nickname, is_primary || false]
  );
  return rows[0];
};

exports.getBrokersByUser = async (user_id) => {
  const { rows } = await db.query(
    `SELECT * FROM auth.user_brokers
     WHERE user_id = $1 AND is_active = true
     ORDER BY is_primary DESC, created_at ASC`,
    [user_id]
  );
  return rows;
};

exports.updateBroker = async (id, { nickname, is_primary, is_active }) => {
  const { rows } = await db.query(
    `UPDATE auth.user_brokers SET
       nickname   = COALESCE($1, nickname),
       is_primary = COALESCE($2, is_primary),
       is_active  = COALESCE($3, is_active)
     WHERE id = $4
     RETURNING *`,
    [nickname, is_primary, is_active, id]
  );
  return rows[0];
};

exports.deleteBroker = async (id) => {
  await db.query(
    `UPDATE auth.user_brokers SET is_active = false WHERE id = $1`,
    [id]
  );
};
