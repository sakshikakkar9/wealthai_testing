// modules/bond/services/bond.services.js
import db from '../../../shared/dbconnection';

exports.getBondMaster = async ({ search, bond_type } = {}) => {
  let q = `SELECT * FROM bond.bond_master WHERE 1=1`;
  const p = [];
  if (search)    { p.push(`%${search}%`); q += ` AND (bond_name ILIKE $${p.length} OR issuer_name ILIKE $${p.length})`; }
  if (bond_type) { p.push(bond_type);     q += ` AND bond_type = $${p.length}`; }
  q += ` ORDER BY bond_name ASC`;
  const { rows } = await db.query(q, p);
  return rows;
};

exports.addHolding = async ({ user_id, bond_id, platform, demat_account, quantity, avg_purchase_price, invested_amount, purchase_date, maturity_amount, remarks }) => {
  const { rows } = await db.query(
    `INSERT INTO bond.bond_holdings
       (user_id, bond_id, platform, demat_account, quantity, avg_purchase_price, invested_amount, purchase_date, maturity_amount, remarks)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [user_id, bond_id, platform, demat_account, quantity, avg_purchase_price, invested_amount, purchase_date, maturity_amount, remarks]
  );
  return rows[0];
};

exports.getAllHoldings = async (user_id) => {
  const { rows } = await db.query(
    `SELECT h.id, h.quantity, h.avg_purchase_price, h.invested_amount,
            h.purchase_date, h.maturity_amount, h.status, h.platform,
            b.bond_name, b.bond_type, b.issuer_name, b.coupon_rate,
            b.maturity_date, b.isin, b.face_value, b.current_price
     FROM bond.bond_holdings h
     JOIN bond.bond_master b ON b.id = h.bond_id
     WHERE h.user_id = $1 AND h.is_deleted = false
     ORDER BY h.created_at DESC`,
    [user_id]
  );
  return rows;
};

exports.getHoldingById = async (id) => {
  const { rows } = await db.query(
    `SELECT h.*, b.bond_name, b.bond_type, b.issuer_name, b.coupon_rate,
            b.face_value, b.interest_frequency, b.issue_date,
            b.maturity_date, b.credit_rating, b.isin
     FROM bond.bond_holdings h
     JOIN bond.bond_master b ON b.id = h.bond_id
     WHERE h.id = $1 AND h.is_deleted = false`,
    [id]
  );
  return rows[0];
};

exports.updateHolding = async (id, { platform, quantity, avg_purchase_price, invested_amount, maturity_amount, status, remarks }) => {
  const { rows } = await db.query(
    `UPDATE bond.bond_holdings SET
       platform           = COALESCE($1, platform),
       quantity           = COALESCE($2, quantity),
       avg_purchase_price = COALESCE($3, avg_purchase_price),
       invested_amount    = COALESCE($4, invested_amount),
       maturity_amount    = COALESCE($5, maturity_amount),
       status             = COALESCE($6, status),
       remarks            = COALESCE($7, remarks),
       updated_at         = NOW()
     WHERE id = $8 AND is_deleted = false RETURNING *`,
    [platform, quantity, avg_purchase_price, invested_amount, maturity_amount, status, remarks, id]
  );
  return rows[0];
};

exports.deleteHolding = async (id) => {
  await db.query(`UPDATE bond.bond_holdings SET is_deleted = true, updated_at = NOW() WHERE id = $1`, [id]);
};

exports.addTransaction = async ({ holding_id, txn_type, txn_date, quantity, price, total_amount, accrued_interest, remarks }) => {
  const { rows } = await db.query(
    `INSERT INTO bond.bond_transactions
       (holding_id, txn_type, txn_date, quantity, price, total_amount, accrued_interest, remarks)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [holding_id, txn_type, txn_date, quantity, price, total_amount, accrued_interest || 0, remarks]
  );
  return rows[0];
};

exports.getTransactions = async (holding_id) => {
  const { rows } = await db.query(
    `SELECT * FROM bond.bond_transactions WHERE holding_id = $1 ORDER BY txn_date DESC`,
    [holding_id]
  );
  return rows;
};
