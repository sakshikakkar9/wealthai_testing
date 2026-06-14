// modules/deposits/services/deposits.services.js
import db from '../../../shared/dbconnection';

exports.addHolding = async ({ user_id, account_type, account_number, account_name, institution_name, institution_branch, principal_amount, current_value, interest_rate, interest_type, compounding_freq, monthly_instalment, start_date, maturity_date, tenure_months, maturity_amount, maturity_action, nominee_name, nps_tier, nps_scheme }) => {
  const { rows } = await db.query(
    `INSERT INTO deposits.account_holdings
       (user_id, account_type, account_number, account_name, institution_name, institution_branch,
        principal_amount, current_value, interest_rate, interest_type, compounding_freq,
        monthly_instalment, start_date, maturity_date, tenure_months, maturity_amount,
        maturity_action, nominee_name, nps_tier, nps_scheme)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
     RETURNING *`,
    [user_id, account_type, account_number, account_name, institution_name, institution_branch,
     principal_amount, current_value || principal_amount, interest_rate, interest_type,
     compounding_freq, monthly_instalment, start_date, maturity_date, tenure_months,
     maturity_amount, maturity_action, nominee_name, nps_tier, nps_scheme]
  );
  return rows[0];
};

exports.getAllHoldings = async (user_id, account_type) => {
  let q = `SELECT * FROM deposits.account_holdings WHERE user_id = $1 AND is_deleted = false`;
  const p = [user_id];
  if (account_type) { p.push(account_type); q += ` AND account_type = $${p.length}`; }
  q += ` ORDER BY created_at DESC`;
  const { rows } = await db.query(q, p);
  return rows;
};

exports.getHoldingById = async (id) => {
  const { rows } = await db.query(
    `SELECT * FROM deposits.account_holdings WHERE id = $1 AND is_deleted = false`,
    [id]
  );
  return rows[0];
};

exports.updateHolding = async (id, { account_name, institution_name, current_value, interest_rate, maturity_date, maturity_amount, maturity_action, nominee_name, status }) => {
  const { rows } = await db.query(
    `UPDATE deposits.account_holdings SET
       account_name     = COALESCE($1,  account_name),
       institution_name = COALESCE($2,  institution_name),
       current_value    = COALESCE($3,  current_value),
       interest_rate    = COALESCE($4,  interest_rate),
       maturity_date    = COALESCE($5,  maturity_date),
       maturity_amount  = COALESCE($6,  maturity_amount),
       maturity_action  = COALESCE($7,  maturity_action),
       nominee_name     = COALESCE($8,  nominee_name),
       status           = COALESCE($9,  status),
       updated_at       = NOW()
     WHERE id = $10 AND is_deleted = false RETURNING *`,
    [account_name, institution_name, current_value, interest_rate, maturity_date, maturity_amount, maturity_action, nominee_name, status, id]
  );
  return rows[0];
};

exports.deleteHolding = async (id) => {
  await db.query(`UPDATE deposits.account_holdings SET is_deleted = true, updated_at = NOW() WHERE id = $1`, [id]);
};

exports.addTransaction = async ({ holding_id, user_id, transaction_type, amount, closing_balance, transaction_date, value_date, reference_number, remarks, interest_rate, interest_period, employer_contribution, employee_contribution, eps_contribution }) => {
  const { rows } = await db.query(
    `INSERT INTO deposits.account_transactions
       (holding_id, user_id, transaction_type, amount, closing_balance, transaction_date,
        value_date, reference_number, remarks, interest_rate, interest_period,
        employer_contribution, employee_contribution, eps_contribution)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
    [holding_id, user_id, transaction_type, amount, closing_balance, transaction_date,
     value_date, reference_number, remarks, interest_rate, interest_period,
     employer_contribution, employee_contribution, eps_contribution]
  );
  return rows[0];
};

exports.getTransactions = async (holding_id) => {
  const { rows } = await db.query(
    `SELECT * FROM deposits.account_transactions WHERE holding_id = $1 ORDER BY transaction_date DESC`,
    [holding_id]
  );
  return rows;
};
