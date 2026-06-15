// modules/mutual-fund/controllers/mf.crud.controller.js
const services                   = require('../services/mf.crud.services');
const { sendSuccess, sendError } = require('../../../shared/response');

exports.getHoldings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // AUTH BYPASS — re-enable for production
    const userId = req.user?.user_id || '00000000-0000-0000-0000-000000000000';
    const holdings = await services.getHoldings(userId);
    return sendSuccess(res, {
      data: holdings,
      pagination: {
        page: 1,
        limit: 20,
        total: holdings.length,
        total_pages: 1
      }
    });
  } catch (err) { next(err); }
};

exports.getHoldingsSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.user_id || '00000000-0000-0000-0000-000000000000';
    const summary = await services.getHoldingsSummary(userId);
    return sendSuccess(res, summary);
  } catch (err) { next(err); }
};

exports.addHolding = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { scheme_id, folio_number } = req.body;
    if (!scheme_id) return sendError(res, 'scheme_id is required', 400);
    const holding = await services.addHolding({ ...req.body, user_id: req.user.user_id });
    return sendSuccess(res, holding, 'MF holding added', 201);
  } catch (err) { next(err); }
};

exports.addTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { holding_id, scheme_id, txn_type, units, nav, amount } = req.body;
    if (!holding_id || !txn_type || !units || !nav || !amount) {
      return sendError(res, 'holding_id, txn_type, units, nav and amount are required', 400);
    }
    const txn = await services.addTransaction(req.body);
    return sendSuccess(res, txn, 'Transaction recorded', 201);
  } catch (err) { next(err); }
};

exports.getTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { holding_id } = req.query;
    if (!holding_id) return sendError(res, 'holding_id query param is required', 400);
    const txns = await services.getTransactions(holding_id);
    return sendSuccess(res, txns);
  } catch (err) { next(err); }
};

exports.updateHolding = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const holding = await services.updateHolding(req.params.id, req.body);
    return sendSuccess(res, holding, 'MF holding updated');
  } catch (err) { next(err); }
};

exports.deleteHolding = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await services.deleteHolding(req.params.id);
    return sendSuccess(res, null, 'MF holding deleted');
  } catch (err) { next(err); }
};
