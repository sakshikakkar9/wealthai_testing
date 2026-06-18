// modules/india-market/controllers/equity.controller.js
const services                   = require('../services/equity.services');
const { sendSuccess, sendError } = require('../../../shared/response');

exports.getHoldings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // AUTH BYPASS — re-enable for production
    const userId = req.user?.user_id || '00000000-0000-0000-0000-000000000000';
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

exports.createHolding = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.user_id || '00000000-0000-0000-0000-000000000000';
    const holding = await services.createHolding({ ...req.body, user_id: userId });
    return sendSuccess(res, holding, 'Equity holding created', 201);
  } catch (err) { next(err); }
};

exports.updateHolding = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const holding = await services.updateHolding(req.params.id, req.body);
    return sendSuccess(res, holding, 'Equity holding updated');
  } catch (err) { next(err); }
};

exports.deleteHolding = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await services.deleteHolding(req.params.id);
    return sendSuccess(res, null, 'Equity holding deleted');
  } catch (err) { next(err); }
};
