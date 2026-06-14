// modules/india-market/services/equity.services.js
import db from '../../../shared/dbconnection';

exports.getHoldings = async (user_id) => {
  const { rows } = await db.query(
    `SELECT
       h.id, h.quantity, h.avg_buy_price, h.current_price,
       h.unrealised_pnl AS pnl, h.last_updated,
       i.symbol AS ticker_symbol, i.name AS stock_name, i.exchange, i.isin,
       ub.nickname  AS broker_nickname,
       ub.broker_name,
       (h.quantity * h.avg_buy_price)  AS invested_amount,
       (h.quantity * h.current_price)  AS current_value,
       CASE
         WHEN (h.quantity * h.avg_buy_price) > 0 THEN
           (h.unrealised_pnl / (h.quantity * h.avg_buy_price)) * 100
         ELSE 0
       END AS pnl_percent
     FROM india_market.equity_holdings h
     JOIN india_market.instruments i ON i.id = h.instrument_id
     JOIN auth.user_brokers ub        ON ub.id = h.broker_account_id
     WHERE h.user_id = $1
     ORDER BY i.symbol ASC`,
    [user_id]
  );
  return rows;
};

exports.getTransactions = async (user_id, { from, to, broker_account_id } = {}) => {
  let q = `
    SELECT
      t.id, t.transaction_type, t.trade_type, t.quantity,
      t.price, t.realised_pnl, t.brokerage, t.taxes_and_charges, t.traded_at,
      i.symbol, i.name AS company_name
    FROM india_market.equity_transactions t
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

exports.getOrders = async (user_id, { status, order_source, from, to } = {}) => {
  let q = `
    SELECT o.*, i.symbol, i.instrument_type, i.option_type, i.strike_price, i.expiry_date
    FROM india_market.orders o
    JOIN india_market.instruments i ON i.id = o.instrument_id
    WHERE o.user_id = $1`;
  const p = [user_id];
  if (status)       { p.push(status);       q += ` AND o.status = $${p.length}`; }
  if (order_source) { p.push(order_source); q += ` AND o.order_source = $${p.length}`; }
  if (from)         { p.push(from);         q += ` AND o.placed_at >= $${p.length}`; }
  if (to)           { p.push(to);           q += ` AND o.placed_at <= $${p.length}`; }
  q += ` ORDER BY o.placed_at DESC LIMIT 200`;
  const { rows } = await db.query(q, p);
  return rows;
};

exports.getDividends = async (user_id) => {
  const { rows } = await db.query(
    `SELECT d.*, i.symbol, i.name AS company_name
     FROM india_market.dividends d
     JOIN india_market.instruments i ON i.id = d.instrument_id
     WHERE d.user_id = $1
     ORDER BY d.ex_date DESC`,
    [user_id]
  );
  return rows;
};

exports.getCorporateActions = async (instrument_id) => {
  let q = `
    SELECT ca.*, i.symbol, i.name AS company_name
    FROM india_market.corporate_actions ca
    JOIN india_market.instruments i ON i.id = ca.instrument_id
    WHERE 1=1`;
  const p = [];
  if (instrument_id) { p.push(instrument_id); q += ` AND ca.instrument_id = $${p.length}`; }
  q += ` ORDER BY ca.ex_date DESC LIMIT 100`;
  const { rows } = await db.query(q, p);
  return rows;
};
