// modules/mutual-fund/services/mf.sip.services.js
import db from '../../../shared/dbconnection';

exports.getSips = async (user_id) => {
  const { rows } = await db.query(
    `SELECT p.*, s.scheme_name, s.fund_house, s.plan_type
     FROM mutual_fund.mf_systematic_plans p
     JOIN mutual_fund.mf_schemes s ON s.scheme_id = p.scheme_id
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC`,
    [user_id]
  );
  return rows;
};

exports.addSip = async ({ user_id, scheme_id, plan_type, amount, frequency, sip_date, start_date, end_date, mandate_id }) => {
  const { rows } = await db.query(
    `INSERT INTO mutual_fund.mf_systematic_plans
       (user_id, scheme_id, plan_type, amount, frequency, sip_date, start_date, end_date, mandate_id, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'active')
     RETURNING *`,
    [user_id, scheme_id, plan_type, amount, frequency, sip_date, start_date, end_date, mandate_id]
  );
  return rows[0];
};

exports.updateSip = async (id, { amount, end_date, status }) => {
  const { rows } = await db.query(
    `UPDATE mutual_fund.mf_systematic_plans SET
       amount   = COALESCE($1, amount),
       end_date = COALESCE($2, end_date),
       status   = COALESCE($3, status)
     WHERE id = $4 RETURNING *`,
    [amount, end_date, status, id]
  );
  return rows[0];
};

exports.cancelSip = async (id) => {
  await db.query(
    `UPDATE mutual_fund.mf_systematic_plans SET status = 'cancelled' WHERE id = $1`,
    [id]
  );
};
