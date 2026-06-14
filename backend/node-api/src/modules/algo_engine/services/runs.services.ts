// modules/trading-strategy/services/runs.services.js

exports.getRunsByDeployment = async (deployment_id, limit = 30) => {
  const { rows } = await db.query(
    `SELECT
       id, run_date, status, pnl, pnl_pct, capital,
       multiplier, stop_reason, start_time, end_time, created_at
     FROM algo.deployment_runs
     WHERE deployment_id = $1
     ORDER BY run_date DESC
     LIMIT $2`,
    [deployment_id, limit.toString()]
  );
  return rows;
};

exports.getTrades = async (run_id) => {
  const { rows } = await db.query(
    `SELECT
       id, instrument, product, side, quantity, avg_price,
       status, order_type, validity, order_time,
       broker_order_id, exchange_order_id,
       rejection_reason, filled_quantity, pending_quantity
     FROM algo.trade_orderbook
     WHERE run_id = $1
     ORDER BY order_time ASC`,
    [run_id]
  );
  return rows;
};

exports.getPositions = async (run_id) => {
  const { rows } = await db.query(
    `SELECT
       id, instrument, product, status, quantity,
       entry_time, entry_price, entry_order_id,
       exit_time, exit_price, exit_order_id,
       pnl, pnl_pct
     FROM algo.trade_positions
     WHERE run_id = $1
     ORDER BY entry_time ASC`,
    [run_id]
  );
  return rows;
};

exports.getLogs = async (run_id) => {
  const { rows } = await db.query(
    `SELECT
       log_time, log_level, log_message, event_type, log_context
     FROM algo.trade_logs
     WHERE run_id = $1
     ORDER BY log_time ASC`,
    [run_id]
  );
  return rows;
};
