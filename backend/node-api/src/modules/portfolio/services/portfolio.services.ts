// modules/portfolio/services/portfolio.services.js
// Aggregates data across all modules for portfolio dashboard
import db from '../../../shared/dbconnection';
exports.getSummary = async (user_id) => {
  const [deposits, bonds, mf, equity, algo] = await Promise.all([

    db.query(
      `SELECT COUNT(*)               AS total_accounts,
              SUM(principal_amount)  AS total_invested,
              SUM(current_value)     AS total_current_value
       FROM deposits.account_holdings
       WHERE user_id = $1 AND is_deleted = false AND status = 'active'`,
      [user_id]
    ),

    db.query(
      `SELECT COUNT(*)               AS total_holdings,
              SUM(invested_amount)   AS total_invested,
              SUM(maturity_amount)   AS total_maturity_value
       FROM bond.bond_holdings
       WHERE user_id = $1 AND is_deleted = false AND status = 'active'`,
      [user_id]
    ),

    db.query(
      `SELECT COUNT(*)              AS total_holdings,
              SUM(invested_amount)  AS total_invested,
              SUM(units * (
                SELECT nav_value FROM mutual_fund.mf_nav_history
                WHERE scheme_id = h.scheme_id ORDER BY nav_date DESC LIMIT 1
              ))                    AS total_current_value
       FROM mutual_fund.mf_holdings h
       WHERE user_id = $1 AND is_active = true`,
      [user_id]
    ),

    db.query(
      `SELECT COUNT(*)                           AS total_holdings,
              SUM(quantity * avg_buy_price)      AS total_invested,
              SUM(quantity * current_price)      AS total_current_value,
              SUM(unrealised_pnl)                AS total_unrealised_pnl
       FROM india_market.equity_holdings
       WHERE user_id = $1`,
      [user_id]
    ),

    db.query(
      `SELECT COUNT(*)       AS total_deployments,
              SUM(total_pnl) AS total_pnl
       FROM algo.deployments
       WHERE user_id = $1 AND is_deleted = false AND status = 'active'`,
      [user_id]
    ),
  ]);

  const d  = deposits.rows[0];
  const b  = bonds.rows[0];
  const m  = mf.rows[0];
  const e  = equity.rows[0];
  const a  = algo.rows[0];

  const grandInvested = [
    parseFloat(d?.total_invested       || 0),
    parseFloat(b?.total_invested       || 0),
    parseFloat(m?.total_invested       || 0),
    parseFloat(e?.total_invested       || 0),
  ].reduce((acc, v) => acc + v, 0);

  const grandCurrent = [
    parseFloat(d?.total_current_value  || 0),
    parseFloat(b?.total_maturity_value || 0),
    parseFloat(m?.total_current_value  || 0),
    parseFloat(e?.total_current_value  || 0),
  ].reduce((acc, v) => acc + v, 0);

  return {
    deposits:     d,
    bonds:        b,
    mutual_funds: m,
    equity:       e,
    algo:         a,
    grand_total_invested:      grandInvested,
    grand_total_current_value: grandCurrent,
    grand_total_gain:          grandCurrent - grandInvested,
    grand_gain_pct:            grandInvested > 0
      ? (((grandCurrent - grandInvested) / grandInvested) * 100).toFixed(2)
      : '0.00',
  };
};

exports.getAllocation = async (user_id) => {
  const summary = await exports.getSummary(user_id);
  const total   = summary.grand_total_invested || 1;

  return [
    {
      asset_class:    'Deposits',
      invested:       parseFloat(summary.deposits?.total_invested    || 0),
      allocation_pct: ((parseFloat(summary.deposits?.total_invested    || 0) / total) * 100).toFixed(2),
    },
    {
      asset_class:    'Bonds',
      invested:       parseFloat(summary.bonds?.total_invested        || 0),
      allocation_pct: ((parseFloat(summary.bonds?.total_invested        || 0) / total) * 100).toFixed(2),
    },
    {
      asset_class:    'Mutual Funds',
      invested:       parseFloat(summary.mutual_funds?.total_invested  || 0),
      allocation_pct: ((parseFloat(summary.mutual_funds?.total_invested  || 0) / total) * 100).toFixed(2),
    },
    {
      asset_class:    'Equity',
      invested:       parseFloat(summary.equity?.total_invested        || 0),
      allocation_pct: ((parseFloat(summary.equity?.total_invested        || 0) / total) * 100).toFixed(2),
    },
  ];
};

exports.getPnl = async (user_id) => {
  const [equityPnl, fnoPnl, equityUnrealised, algoPnl] = await Promise.all([

    db.query(
      `SELECT SUM(realised_pnl) AS total_realised_pnl, COUNT(*) AS total_trades
       FROM india_market.equity_transactions
       WHERE user_id = $1 AND transaction_type = 'SELL'`,
      [user_id]
    ),

    db.query(
      `SELECT SUM(realised_pnl) AS total_realised_pnl, COUNT(*) AS total_trades
       FROM india_market.fno_transactions
       WHERE user_id = $1 AND trade_type IN ('exit','expiry')`,
      [user_id]
    ),

    db.query(
      `SELECT SUM(unrealised_pnl) AS total_unrealised_pnl
       FROM india_market.equity_holdings
       WHERE user_id = $1`,
      [user_id]
    ),

    db.query(
      `SELECT SUM(dr.pnl) AS total_pnl
       FROM algo.deployment_runs dr
       JOIN algo.deployments d ON d.id = dr.deployment_id
       WHERE d.user_id = $1`,
      [user_id]
    ),
  ]);

  const eR  = parseFloat(equityPnl.rows[0]?.total_realised_pnl      || 0);
  const fR  = parseFloat(fnoPnl.rows[0]?.total_realised_pnl         || 0);
  const eU  = parseFloat(equityUnrealised.rows[0]?.total_unrealised_pnl || 0);
  const aP  = parseFloat(algoPnl.rows[0]?.total_pnl                 || 0);

  return {
    equity: {
      realised_pnl:   eR,
      unrealised_pnl: eU,
      total_trades:   parseInt(equityPnl.rows[0]?.total_trades || 0),
    },
    fno: {
      realised_pnl: fR,
      total_trades: parseInt(fnoPnl.rows[0]?.total_trades || 0),
    },
    algo: {
      total_pnl: aP,
    },
    total_realised_pnl:   eR + fR + aP,
    total_unrealised_pnl: eU,
    overall_pnl:          eR + fR + aP + eU,
  };
};

exports.getAllTransactions = async (user_id) => {
  const sql = `
    SELECT id, 'Bond' as module, txn_type as type, total_amount as amount, txn_date as date, 'confirmed' as status
    FROM bond.bond_transactions
    WHERE holding_id IN (SELECT id FROM bond.bond_holdings WHERE user_id = $1)

    UNION ALL

    SELECT id, 'Deposits' as module, transaction_type as type, amount, transaction_date as date, 'confirmed' as status
    FROM deposits.account_transactions
    WHERE user_id = $1

    UNION ALL

    SELECT id, 'Mutual Fund' as module, txn_type as type, amount, transaction_date as date, 'confirmed' as status
    FROM mutual_fund.mf_transactions
    WHERE holding_id IN (SELECT id FROM mutual_fund.mf_holdings WHERE user_id = $1)

    UNION ALL

    SELECT id, 'Equity' as module, transaction_type as type, (quantity * price) as amount, traded_at as date, 'confirmed' as status
    FROM india_market.equity_transactions
    WHERE user_id = $1

    ORDER BY date DESC
  `;
  const { rows } = await db.query(sql, [user_id]);
  return rows;
};

exports.getHoldings = async (user_id) => {
  const [bonds, deposits, mf, equity] = await Promise.all([
    db.query(`SELECT h.id, b.bond_name as name, b.isin as ticker, 'bond' as asset_class, h.invested_amount, h.maturity_amount as current_value, h.status FROM bond.bond_holdings h JOIN bond.bond_master b ON b.id = h.bond_id WHERE h.user_id = $1 AND h.is_deleted = false`, [user_id]),
    db.query(`SELECT id, institution_name as name, account_number as ticker, 'fd' as asset_class, principal_amount as invested_amount, current_value, status FROM deposits.account_holdings WHERE user_id = $1 AND is_deleted = false`, [user_id]),
    db.query(`SELECT h.id, s.scheme_name as name, s.scheme_id as ticker, 'mutual_fund' as asset_class, h.invested_amount, (h.units * (SELECT nav_value FROM mutual_fund.mf_nav_history WHERE scheme_id = h.scheme_id ORDER BY nav_date DESC LIMIT 1)) as current_value FROM mutual_fund.mf_holdings h JOIN mutual_fund.mf_schemes s ON s.scheme_id = h.scheme_id WHERE h.user_id = $1 AND h.is_active = true`, [user_id]),
    db.query(`SELECT h.id, i.name as name, i.symbol as ticker, 'equity' as asset_class, (h.quantity * h.avg_buy_price) as invested_amount, (h.quantity * h.current_price) as current_value FROM india_market.equity_holdings h JOIN india_market.instruments i ON i.id = h.instrument_id WHERE h.user_id = $1`, [user_id])
  ]);

  const all = [
    ...bonds.rows,
    ...deposits.rows,
    ...mf.rows,
    ...equity.rows
  ].map(h => ({
    ...h,
    invested_amount: parseFloat(h.invested_amount || 0),
    current_value: parseFloat(h.current_value || 0),
    gain_loss: parseFloat(h.current_value || 0) - parseFloat(h.invested_amount || 0),
    gain_loss_pct: parseFloat(h.invested_amount || 0) > 0
      ? ((parseFloat(h.current_value || 0) - parseFloat(h.invested_amount || 0)) / parseFloat(h.invested_amount || 0) * 100).toFixed(2)
      : 0,
    weight: 0, // Should be calculated based on total
    day_change: 0,
    day_change_pct: 0
  }));

  const totalValue = all.reduce((sum, h) => sum + h.current_value, 0) || 1;
  return all.map(h => ({ ...h, weight: ((h.current_value / totalValue) * 100).toFixed(2) }));
};
