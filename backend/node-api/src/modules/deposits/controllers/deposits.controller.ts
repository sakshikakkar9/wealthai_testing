// deposits.controller.ts
import { Request, Response } from 'express';
const services = require('../services/deposits.services');

interface AuthRequest extends Request {
  user?: any;
}

export const getDeposits = async (req: AuthRequest, res: Response) => {
  try {
    // AUTH BYPASS — re-enable for production
    const userId = req.user?.user_id || '1';
    const holdings = await services.getAllHoldings(userId, req.query.account_type);
    res.json({ success: true, data: holdings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDeposit = async (req: AuthRequest, res: Response) => {
  try {
    const { account_type, principal_amount, start_date } = req.body;
    if (!account_type || !principal_amount || !start_date) {
      return res.status(400).json({ success: false, message: 'account_type, principal_amount and start_date are required' });
    }
    const holding = await services.addHolding({ ...req.body, user_id: req.user.user_id });
    res.status(201).json({ success: true, data: holding });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDeposit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const holding = await services.updateHolding(id, req.body);
    res.json({ success: true, data: holding });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDeposit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await services.deleteHolding(id);
    res.json({ success: true, message: 'Deposit deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const closeDeposit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await services.updateHolding(id, { status: 'broken' });
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
