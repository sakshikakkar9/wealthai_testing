// modules/india-market/services/instruments.services.js

exports.getInstruments = async ({ symbol, exchange, instrument_type, segment } = {}) => {
  let q = `SELECT * FROM india_market.instruments WHERE is_active = true`;
  const p = [];
  if (symbol)          { p.push(`%${symbol}%`);  q += ` AND symbol ILIKE $${p.length}`; }
  if (exchange)        { p.push(exchange);         q += ` AND exchange = $${p.length}`; }
  if (instrument_type) { p.push(instrument_type);  q += ` AND instrument_type = $${p.length}`; }
  if (segment)         { p.push(segment);          q += ` AND segment = $${p.length}`; }
  q += ` ORDER BY symbol ASC LIMIT 200`;
  const { rows } = await db.query(q, p);
  return rows;
};

exports.getInstrumentById = async (id) => {
  const { rows } = await db.query(
    `SELECT i.*, m.sector, m.industry, m.index_name, m.weightage
     FROM india_market.instruments i
     LEFT JOIN india_market.instrument_metadata m ON m.instrument_id = i.id
     WHERE i.id = $1`,
    [id]
  );
  return rows[0];
};
