// modules/mutual-fund/controllers/mf.crud.controller.js
const services                   = require('../services/mf.crud.services');
const { sendSuccess, sendError } = require('../../../shared/response');

exports.getHoldings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const holdings = await services.getHoldings(req.user.user_id);
    return sendSuccess(res, holdings);
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
