// modules/mutual-fund/services/mf.nav.services.js
import db from '../../../shared/dbconnection';

exports.getSchemes = async ({ search, category, fund_house, plan_type } = {}) => {
  let q = `SELECT s.*, m.expense_ratio, m.aum_in_crores, m.star_rating
           FROM mutual_fund.mf_schemes s
           LEFT JOIN mutual_fund.mf_scheme_metadata m ON m.scheme_id = s.scheme_id
           WHERE s.is_active = true`;
  const p = [];
  if (search)     { p.push(`%${search}%`);    q += ` AND s.scheme_name ILIKE $${p.length}`; }
  if (category)   { p.push(category);          q += ` AND s.category = $${p.length}`; }
  if (fund_house) { p.push(`%${fund_house}%`); q += ` AND s.fund_house ILIKE $${p.length}`; }
  if (plan_type)  { p.push(plan_type);         q += ` AND s.plan_type = $${p.length}`; }
  q += ` ORDER BY s.scheme_name ASC LIMIT 100`;
  const { rows } = await db.query(q, p);
  return rows;
};

exports.getSchemeById = async (id) => {
  const { rows } = await db.query(
    `SELECT s.*, m.*, b.name AS benchmark_name
     FROM mutual_fund.mf_schemes s
     LEFT JOIN mutual_fund.mf_scheme_metadata m ON m.scheme_id = s.scheme_id
     LEFT JOIN mutual_fund.mf_benchmarks b      ON b.benchmark_id = s.benchmark_id
     WHERE s.scheme_id = $1`,
    [id]
  );
  return rows[0];
};

exports.getNavHistory = async (scheme_id, { from, to, limit = 365 } = {}) => {
  let q = `SELECT nav_date, nav_value, day_change_percent
           FROM mutual_fund.mf_nav_history WHERE scheme_id = $1`;
  const p = [scheme_id];
  if (from) { p.push(from); q += ` AND nav_date >= $${p.length}`; }
  if (to)   { p.push(to);   q += ` AND nav_date <= $${p.length}`; }
  p.push(limit);
  q += ` ORDER BY nav_date DESC LIMIT $${p.length}`;
  const { rows } = await db.query(q, p);
  return rows;
};
