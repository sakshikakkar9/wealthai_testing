// modules/trading-strategy/services/strategy.services.js

const j = (v) => v ? JSON.stringify(v) : null;

exports.addStrategy = async ({ user_id, strategy_name, strategy_desc, capital, entry_days, time_window, max_daily_entries, reentry_cooldown_minutes, entry_conditions, exit_conditions, risk_conditions, adjustments, is_public }) => {
  const { rows } = await db.query(
    `INSERT INTO algo.strategies
       (user_id, strategy_name, strategy_desc, capital, entry_days, time_window,
        max_daily_entries, reentry_cooldown_minutes, entry_conditions, exit_conditions,
        risk_conditions, adjustments, is_public)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [user_id, strategy_name, strategy_desc, capital, j(entry_days), j(time_window),
     max_daily_entries, reentry_cooldown_minutes, j(entry_conditions), j(exit_conditions),
     j(risk_conditions), j(adjustments), is_public || false]
  );
  return rows[0];
};

exports.getAllStrategies = async (user_id) => {
  const { rows } = await db.query(
    `SELECT id, strategy_name, strategy_desc, capital, enabled, is_public, version, created_at, updated_at
     FROM algo.strategies WHERE user_id = $1 AND is_deleted = false ORDER BY created_at DESC`,
    [user_id]
  );
  return rows;
};

exports.getStrategyById = async (id) => {
  const { rows } = await db.query(`SELECT * FROM algo.strategies WHERE id = $1 AND is_deleted = false`, [id]);
  if (!rows.length) return null;
  const strategy = rows[0];
  const { rows: sets } = await db.query(`SELECT * FROM algo.strategy_sets WHERE strategy_id = $1 ORDER BY set_order ASC`, [id]);
  for (const set of sets) {
    const { rows: positions } = await db.query(`SELECT * FROM algo.strategy_positions WHERE set_id = $1 ORDER BY position_order ASC`, [set.id]);
    set.positions = positions;
  }
  strategy.sets = sets;
  return strategy;
};

exports.updateStrategy = async (id, { strategy_name, strategy_desc, capital, enabled, is_public, entry_conditions, exit_conditions, risk_conditions }) => {
  const { rows } = await db.query(
    `UPDATE algo.strategies SET
       strategy_name    = COALESCE($1, strategy_name),
       strategy_desc    = COALESCE($2, strategy_desc),
       capital          = COALESCE($3, capital),
       enabled          = COALESCE($4, enabled),
       is_public        = COALESCE($5, is_public),
       entry_conditions = COALESCE($6, entry_conditions),
       exit_conditions  = COALESCE($7, exit_conditions),
       risk_conditions  = COALESCE($8, risk_conditions),
       version          = version + 1,
       updated_at       = NOW()
     WHERE id = $9 AND is_deleted = false RETURNING *`,
    [strategy_name, strategy_desc, capital, enabled, is_public,
     j(entry_conditions), j(exit_conditions), j(risk_conditions), id]
  );
  return rows[0];
};

exports.deleteStrategy = async (id) => {
  await db.query(`UPDATE algo.strategies SET is_deleted = true, updated_at = NOW() WHERE id = $1`, [id]);
};

exports.addSet = async ({ strategy_id, set_order, name, segment, type, instrument, exchange, product, entry_conditions, exit_conditions, risk_conditions, trigger_condition }) => {
  const { rows } = await db.query(
    `INSERT INTO algo.strategy_sets
       (strategy_id, set_order, name, segment, type, instrument, exchange, product,
        entry_conditions, exit_conditions, risk_conditions, trigger_condition)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [strategy_id, set_order, name, segment, type, j(instrument), exchange, product,
     j(entry_conditions), j(exit_conditions), j(risk_conditions), j(trigger_condition)]
  );
  return rows[0];
};

exports.updateSet = async (set_id, { name, segment, exchange, entry_conditions, exit_conditions, risk_conditions }) => {
  const { rows } = await db.query(
    `UPDATE algo.strategy_sets SET
       name             = COALESCE($1, name),
       segment          = COALESCE($2, segment),
       exchange         = COALESCE($3, exchange),
       entry_conditions = COALESCE($4, entry_conditions),
       exit_conditions  = COALESCE($5, exit_conditions),
       risk_conditions  = COALESCE($6, risk_conditions),
       updated_at       = NOW()
     WHERE id = $7 RETURNING *`,
    [name, segment, exchange, j(entry_conditions), j(exit_conditions), j(risk_conditions), set_id]
  );
  return rows[0];
};

exports.deleteSet = async (set_id) => {
  await db.query(`DELETE FROM algo.strategy_sets WHERE id = $1`, [set_id]);
};

exports.addPosition = async ({ set_id, name, position_order, position_type, transaction_type, segment, instrument, exchange, lots, option_type, expiry, strike_selection, order_type, product, risk_conditions, exit_conditions }) => {
  const { rows } = await db.query(
    `INSERT INTO algo.strategy_positions
       (set_id, name, position_order, position_type, transaction_type, segment,
        instrument, exchange, lots, option_type, expiry, strike_selection,
        order_type, product, risk_conditions, exit_conditions)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
    [set_id, name, position_order, position_type, transaction_type, segment,
     instrument, exchange, lots, option_type, expiry, j(strike_selection),
     order_type, product, j(risk_conditions), j(exit_conditions)]
  );
  return rows[0];
};

exports.updatePosition = async (position_id, { name, enabled, lots, order_type, price, risk_conditions, exit_conditions }) => {
  const { rows } = await db.query(
    `UPDATE algo.strategy_positions SET
       name            = COALESCE($1, name),
       enabled         = COALESCE($2, enabled),
       lots            = COALESCE($3, lots),
       order_type      = COALESCE($4, order_type),
       price           = COALESCE($5, price),
       risk_conditions = COALESCE($6, risk_conditions),
       exit_conditions = COALESCE($7, exit_conditions),
       updated_at      = NOW()
     WHERE id = $8 RETURNING *`,
    [name, enabled, lots, order_type, price, j(risk_conditions), j(exit_conditions), position_id]
  );
  return rows[0];
};

exports.deletePosition = async (position_id) => {
  await db.query(`DELETE FROM algo.strategy_positions WHERE id = $1`, [position_id]);
};

exports.subscribe = async ({ user_id, strategy_id, subscription_type }) => {
  const { rows } = await db.query(
    `INSERT INTO algo.strategy_subscriptions (user_id, strategy_id, subscription_type)
     VALUES ($1,$2,$3)
     ON CONFLICT (user_id, strategy_id) DO UPDATE SET status = 'active', updated_at = NOW()
     RETURNING *`,
    [user_id, strategy_id, subscription_type || 'free']
  );
  return rows[0];
};

exports.getSubscriptions = async (user_id) => {
  const { rows } = await db.query(
    `SELECT sub.*, s.strategy_name, s.strategy_desc FROM algo.strategy_subscriptions sub
     JOIN algo.strategies s ON s.id = sub.strategy_id
     WHERE sub.user_id = $1 AND sub.status = 'active' ORDER BY sub.subscribed_at DESC`,
    [user_id]
  );
  return rows;
};
