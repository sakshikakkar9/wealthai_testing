// modules/trading-strategy/services/deployment.services.js

exports.deploy = async ({ user_id, strategy_id, broker_id, deployment_mode, multiplier, capital_allocated, custom_target, custom_sl }) => {
  const { rows } = await db.query(
    `INSERT INTO algo.deployments
       (user_id, strategy_id, broker_id, deployment_mode, multiplier,
        capital_allocated, custom_target, custom_sl, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'active')
     RETURNING *`,
    [user_id, strategy_id, broker_id, deployment_mode,
     multiplier || 1, capital_allocated, custom_target, custom_sl]
  );
  return rows[0];
};

exports.getAllDeployments = async (user_id) => {
  const { rows } = await db.query(
    `SELECT
       d.*,
       s.strategy_name,
       b.broker_name,
       r.run_date        AS latest_run_date,
       r.pnl             AS latest_run_pnl,
       r.pnl_pct         AS latest_run_pnl_pct,
       r.status          AS latest_run_status,
       r.stop_reason     AS latest_run_stop_reason
     FROM algo.deployments d
     JOIN algo.strategies s ON s.id = d.strategy_id
     JOIN algo.brokers    b ON b.id = d.broker_id
     LEFT JOIN LATERAL (
       SELECT * FROM algo.deployment_runs
       WHERE deployment_id = d.id
       ORDER BY run_date DESC LIMIT 1
     ) r ON true
     WHERE d.user_id = $1 AND d.is_deleted = false
     ORDER BY d.created_at DESC`,
    [user_id]
  );
  return rows;
};

exports.getDeploymentById = async (id) => {
  const { rows } = await db.query(
    `SELECT d.*, s.strategy_name, b.broker_name
     FROM algo.deployments d
     JOIN algo.strategies s ON s.id = d.strategy_id
     JOIN algo.brokers    b ON b.id = d.broker_id
     WHERE d.id = $1 AND d.is_deleted = false`,
    [id]
  );
  return rows[0];
};

exports.updateStatus = async (id, status) => {
  const { rows } = await db.query(
    `UPDATE algo.deployments
     SET status = $1, updated_at = NOW()
     WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows[0];
};
