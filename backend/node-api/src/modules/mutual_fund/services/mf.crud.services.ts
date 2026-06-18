// modules/mutual-fund/services/mf.crud.services.js
import db from '../../../shared/dbconnection';

exports.getHoldings = async (user_id) => {
  const { rows } = await db.query(
    `SELECT h.id, h.folio_number, h.units, h.avg_nav, h.invested_amount, h.is_active,
            s.scheme_name, s.fund_house, s.category AS fund_type, s.sub_category, s.plan_type,
            (SELECT nav_value FROM mutual_fund.mf_nav_history
             WHERE scheme_id = h.scheme_id ORDER BY nav_date DESC LIMIT 1) AS nav,
            (SELECT day_change_percent FROM mutual_fund.mf_nav_history
             WHERE scheme_id = h.scheme_id ORDER BY nav_date DESC LIMIT 1) AS day_change_percent,
            ((SELECT nav_value FROM mutual_fund.mf_nav_history
              WHERE scheme_id = h.scheme_id ORDER BY nav_date DESC LIMIT 1) * h.units) AS current_value,
            CASE
              WHEN h.invested_amount > 0 THEN
                ((((SELECT nav_value FROM mutual_fund.mf_nav_history
                    WHERE scheme_id = h.scheme_id ORDER BY nav_date DESC LIMIT 1) * h.units) - h.invested_amount) / h.invested_amount) * 100
              ELSE 0
            END AS returns_percent
     FROM mutual_fund.mf_holdings h
     JOIN mutual_fund.mf_schemes s ON s.scheme_id = h.scheme_id
     WHERE h.user_id = $1 AND h.is_active = true
     ORDER BY h.last_updated_at DESC`,
    [user_id]
  );
  return rows;
};

exports.updateHolding = async (id, { units, avg_nav, invested_amount, is_active }) => {
  const { rows } = await db.query(
    `UPDATE mutual_fund.mf_holdings SET
       units           = COALESCE($1, units),
       avg_nav         = COALESCE($2, avg_nav),
       invested_amount = COALESCE($3, invested_amount),
       is_active       = COALESCE($4, is_active),
       last_updated_at = NOW()
     WHERE id = $5 RETURNING *`,
    [units, avg_nav, invested_amount, is_active, id]
  );
  return rows[0];
};

exports.deleteHolding = async (id) => {
  await db.query(`UPDATE mutual_fund.mf_holdings SET is_active = false, last_updated_at = NOW() WHERE id = $1`, [id]);
};

exports.getHoldingsSummary = async (user_id) => {
  const { rows } = await db.query(
    `WITH holding_current_values AS (
       SELECT
         h.invested_amount,
         h.units * (
           SELECT nav_value FROM mutual_fund.mf_nav_history
           WHERE scheme_id = h.scheme_id ORDER BY nav_date DESC LIMIT 1
         ) AS current_value
       FROM mutual_fund.mf_holdings h
       WHERE h.user_id = $1 AND h.is_active = true
     )
     SELECT
       COUNT(*) AS total_funds,
       SUM(invested_amount) AS total_invested,
       SUM(current_value) AS total_current_value
     FROM holding_current_values`,
    [user_id]
  );

  const summary = rows[0];
  const invested = parseFloat(summary.total_invested || 0);
  const current = parseFloat(summary.total_current_value || 0);

  return {
    total_funds: parseInt(summary.total_funds || 0),
    total_invested: invested.toFixed(2),
    total_current_value: current.toFixed(2),
    total_gain_loss: (current - invested).toFixed(2),
    total_gain_pct: invested > 0 ? (((current - invested) / invested) * 100).toFixed(2) : '0.00',
    today_change: '0.00',
    today_change_pct: '0.00',
    active_sips: 0,
    monthly_sip_amount: '0.00'
  };
};

exports.addHolding = async ({ user_id, scheme_id, folio_number, units, avg_nav, invested_amount }) => {
  const { rows } = await db.query(
    `INSERT INTO mutual_fund.mf_holdings (user_id, scheme_id, folio_number, units, avg_nav, invested_amount)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (user_id, scheme_id, folio_number)
     DO UPDATE SET units = EXCLUDED.units, avg_nav = EXCLUDED.avg_nav,
                   invested_amount = EXCLUDED.invested_amount, last_updated_at = NOW()
     RETURNING *`,
    [user_id, scheme_id, folio_number, units, avg_nav, invested_amount]
  );
  return rows[0];
};

exports.addTransaction = async ({ holding_id, scheme_id, folio_no, txn_type, units, nav, amount, stamp_duty, stt_charges, exit_load, transaction_date, remarks }) => {
  const { rows } = await db.query(
    `INSERT INTO mutual_fund.mf_transactions
       (holding_id, scheme_id, folio_no, txn_type, units, nav, amount,
        stamp_duty, stt_charges, exit_load, transaction_date, remarks)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [holding_id, scheme_id, folio_no, txn_type, units, nav, amount,
     stamp_duty || 0, stt_charges || 0, exit_load || 0, transaction_date, remarks]
  );
  return rows[0];
};

exports.getTransactions = async (holding_id) => {
  const { rows } = await db.query(
    `SELECT * FROM mutual_fund.mf_transactions WHERE holding_id = $1 ORDER BY transaction_date DESC`,
    [holding_id]
  );
  return rows;
};
