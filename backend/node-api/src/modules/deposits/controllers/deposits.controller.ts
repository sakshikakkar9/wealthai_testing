// deposits.controller.ts
import { Request, Response } from 'express';
import pool from '../../../shared/dbconnection';

export const getDeposits = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM fd_holdings ORDER BY created_at DESC`);
    res.json({ success: true, data: result.rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDeposit = async (req: Request, res: Response) => {
  try {
    const { bank_name, principal, interest_rate, start_date, maturity_date, tenure_months, type, status } = req.body;
    const result = await pool.query(
      `INSERT INTO fd_holdings (bank_name, principal, interest_rate, start_date, maturity_date, tenure_months, type, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [bank_name, principal, interest_rate, start_date, maturity_date, tenure_months, type, status ?? 'active']
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDeposit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const result = await pool.query(
      `UPDATE fd_holdings SET ${setClause}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDeposit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM fd_holdings WHERE id = $1`, [id]);
    res.json({ success: true, message: 'Deposit deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const closeDeposit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE fd_holdings SET status = 'broken', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// // modules/deposits/controllers/deposits.controller.js
// const services                   = require('../services/deposits.services');
// const { sendSuccess, sendError } = require('../../../shared/response');

// exports.addHolding = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const { account_type, principal_amount, start_date } = req.body;
//     if (!account_type || !principal_amount || !start_date) {
//       return sendError(res, 'account_type, principal_amount and start_date are required', 400);
//     }
//     const holding = await services.addHolding({ ...req.body, user_id: req.user.user_id });
//     return sendSuccess(res, holding, 'Deposit account added', 201);
//   } catch (err) { next(err); }
// };

// exports.getAllHoldings = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const holdings = await services.getAllHoldings(req.user.user_id, req.query.account_type);
//     return sendSuccess(res, holdings);
//   } catch (err) { next(err); }
// };

// exports.getHoldingById = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const holding = await services.getHoldingById(req.params.id);
//     if (!holding) return sendError(res, 'Deposit not found', 404);
//     return sendSuccess(res, holding);
//   } catch (err) { next(err); }
// };

// exports.updateHolding = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const holding = await services.updateHolding(req.params.id, req.body);
//     return sendSuccess(res, holding, 'Deposit updated');
//   } catch (err) { next(err); }
// };

// exports.deleteHolding = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     await services.deleteHolding(req.params.id);
//     return sendSuccess(res, null, 'Deposit deleted');
//   } catch (err) { next(err); }
// };

// exports.addTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const txn = await services.addTransaction({
//       ...req.body,
//       holding_id: req.params.id,
//       user_id: req.user.user_id,
//     });
//     return sendSuccess(res, txn, 'Transaction added', 201);
//   } catch (err) { next(err); }
// };

// exports.getTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const txns = await services.getTransactions(req.params.id);
//     return sendSuccess(res, txns);
//   } catch (err) { next(err); }
// };
