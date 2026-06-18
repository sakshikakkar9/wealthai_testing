// deposits.controller.ts
import { Request, Response } from 'express';
const services = require('../services/deposits.services');
const { sendSuccess, sendError } = require('../../../shared/response');

interface AuthRequest extends Request {
  user?: {
    user_id: string;
    account_id: string;
  }
}

export const getDeposits = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const { type } = req.query;
    const holdings = await services.getAllHoldings(userId, type);
    return sendSuccess(res, holdings);
  } catch (err: any) {
    return sendError(res, err.message);
  }
};

export const createDeposit = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const holding = await services.addHolding({ ...req.body, user_id: userId });
    return sendSuccess(res, holding, 'Deposit account added', 201);
  } catch (err: any) {
    return sendError(res, err.message);
  }
};

export const updateDeposit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const holding = await services.updateHolding(id, req.body);
    return sendSuccess(res, holding, 'Deposit updated');
  } catch (err: any) {
    return sendError(res, err.message);
  }
};

export const deleteDeposit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await services.deleteHolding(id);
    return sendSuccess(res, null, 'Deposit deleted');
  } catch (err: any) {
    return sendError(res, err.message);
  }
};

export const closeDeposit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await services.updateHolding(id, { status: 'broken' });
    return sendSuccess(res, result, 'Deposit closed');
  } catch (err: any) {
    return sendError(res, err.message);
  }
};
