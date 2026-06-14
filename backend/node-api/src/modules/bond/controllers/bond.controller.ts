// modules/bond/controllers/bond.controller.js
const services                   = require('../services/bond.services');
const { sendSuccess, sendError } = require('../../../shared/response');

exports.getBondMaster = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bonds = await services.getBondMaster(req.query);
    return sendSuccess(res, bonds);
  } catch (err) { next(err); }
};

exports.addHolding = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const holding = await services.addHolding({ ...req.body, user_id: req.user.user_id });
    return sendSuccess(res, holding, 'Bond holding added', 201);
  } catch (err) { next(err); }
};

exports.getAllHoldings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // AUTH BYPASS — re-enable for production
    const userId = req.user?.user_id || '1';
    const holdings = await services.getAllHoldings(userId);
    return sendSuccess(res, holdings);
  } catch (err) { next(err); }
};

exports.getHoldingById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const holding = await services.getHoldingById(req.params.id);
    if (!holding) return sendError(res, 'Holding not found', 404);
    return sendSuccess(res, holding);
  } catch (err) { next(err); }
};

exports.updateHolding = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const holding = await services.updateHolding(req.params.id, req.body);
    return sendSuccess(res, holding, 'Bond holding updated');
  } catch (err) { next(err); }
};

exports.deleteHolding = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await services.deleteHolding(req.params.id);
    return sendSuccess(res, null, 'Bond holding deleted');
  } catch (err) { next(err); }
};

exports.addTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const txn = await services.addTransaction({ ...req.body, holding_id: req.params.id });
    return sendSuccess(res, txn, 'Transaction added', 201);
  } catch (err) { next(err); }
};

exports.getTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const txns = await services.getTransactions(req.params.id);
    return sendSuccess(res, txns);
  } catch (err) { next(err); }
};
