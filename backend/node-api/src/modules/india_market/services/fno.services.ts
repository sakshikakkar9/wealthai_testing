// modules/india-market/services/fno.services.js
import db from '../../../shared/dbconnection';

exports.getPositions = async (user_id, status = 'open') => {
  const { rows } = await db.query(
    `SELECT
       p.id, p.transaction_type, p.product, p.lots, p.quantity,
       p.avg_price, p.current_price, p.unrealised_pnl, p.status,
       p.opened_at, p.closed_at,
       i.symbol, i.instrument_type, i.option_type,
       i.strike_price, i.expiry_date, i.exchange
     FROM india_market.fno_positions p
     JOIN india_market.instruments i ON i.id = p.instrument_id
     WHERE p.user_id = $1 AND p.status = $2
     ORDER BY p.opened_at DESC`,
    [user_id, status]
  );
  return rows;
};

exports.getTransactions = async (user_id, { from, to, broker_account_id } = {}) => {
  let q = `
    SELECT
      t.id, t.transaction_type, t.product, t.trade_type,
      t.lots, t.quantity, t.price, t.realised_pnl,
      t.brokerage, t.taxes_and_charges, t.traded_at,
      i.symbol, i.option_type, i.strike_price, i.expiry_date
    FROM india_market.fno_transactions t
    JOIN india_market.instruments i ON i.id = t.instrument_id
    WHERE t.user_id = $1`;
  const p = [user_id];
  if (from)              { p.push(from);              q += ` AND t.traded_at >= $${p.length}`; }
  if (to)                { p.push(to);                q += ` AND t.traded_at <= $${p.length}`; }
  if (broker_account_id) { p.push(broker_account_id); q += ` AND t.broker_account_id = $${p.length}`; }
  q += ` ORDER BY t.traded_at DESC LIMIT 500`;
  const { rows } = await db.query(q, p);
  return rows;
};
