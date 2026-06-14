// modules/trading-strategy/controllers/runs.controller.js
const services                   = require('../services/runs.services');
const { sendSuccess }            = require('../../../shared/response');

exports.getRunsByDeployment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const runs = await services.getRunsByDeployment(req.params.deployment_id, req.query.limit);
    return sendSuccess(res, runs);
  } catch (err) { next(err); }
};

exports.getTrades = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const trades = await services.getTrades(req.params.run_id);
    return sendSuccess(res, trades);
  } catch (err) { next(err); }
};

exports.getPositions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const positions = await services.getPositions(req.params.run_id);
    return sendSuccess(res, positions);
  } catch (err) { next(err); }
};

exports.getLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logs = await services.getLogs(req.params.run_id);
    return sendSuccess(res, logs);
  } catch (err) { next(err); }
};
