// modules/india-market/controllers/fno.controller.js
const services                   = require('../services/fno.services');
const { sendSuccess }            = require('../../../shared/response');

exports.getPositions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const positions = await services.getPositions(req.user.user_id, status);
    return sendSuccess(res, positions);
  } catch (err) { next(err); }
};

exports.getTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { from, to, broker_account_id } = req.query;
    const txns = await services.getTransactions(req.user.user_id, { from, to, broker_account_id });
    return sendSuccess(res, txns);
  } catch (err) { next(err); }
};
