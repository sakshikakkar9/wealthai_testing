// modules/india-market/controllers/equity.controller.js
const services                   = require('../services/equity.services');
const { sendSuccess, sendError } = require('../../../shared/response');

exports.getHoldings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // AUTH BYPASS — re-enable for production
    const userId = req.user?.user_id || '1';
    const holdings = await services.getHoldings(userId);
    return sendSuccess(res, holdings);
  } catch (err) { next(err); }
};

exports.getTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { from, to, broker_account_id } = req.query;
    const txns = await services.getTransactions(req.user.user_id, { from, to, broker_account_id });
    return sendSuccess(res, txns);
  } catch (err) { next(err); }
};

exports.getOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status, order_source, from, to } = req.query;
    const orders = await services.getOrders(req.user.user_id, { status, order_source, from, to });
    return sendSuccess(res, orders);
  } catch (err) { next(err); }
};

exports.getDividends = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const dividends = await services.getDividends(req.user.user_id);
    return sendSuccess(res, dividends);
  } catch (err) { next(err); }
};

exports.getCorporateActions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { instrument_id } = req.query;
    const actions = await services.getCorporateActions(instrument_id);
    return sendSuccess(res, actions);
  } catch (err) { next(err); }
};
