// modules/portfolio/controllers/portfolio.controller.js
const services                   = require('../services/portfolio.services');
const { sendSuccess }            = require('../../../shared/response');

exports.getSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const summary = await services.getSummary(req.user.user_id);
    return sendSuccess(res, summary);
  } catch (err) { next(err); }
};

exports.getAllocation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const allocation = await services.getAllocation(req.user.user_id);
    return sendSuccess(res, allocation);
  } catch (err) { next(err); }
};

exports.getPnl = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const pnl = await services.getPnl(req.user.user_id);
    return sendSuccess(res, pnl);
  } catch (err) { next(err); }
};
