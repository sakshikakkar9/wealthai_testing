// modules/trading-strategy/controllers/deployment.controller.js
const services                   = require('../services/deployment.services');
const { sendSuccess, sendError } = require('../../../shared/response');

exports.deploy = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { broker_id, deployment_mode, capital_allocated } = req.body;
    if (!broker_id || !deployment_mode || !capital_allocated) {
      return sendError(res, 'broker_id, deployment_mode and capital_allocated are required', 400);
    }
    const deployment = await services.deploy({ ...req.body, strategy_id: req.params.id, user_id: req.user.user_id });
    return sendSuccess(res, deployment, 'Strategy deployed', 201);
  } catch (err) { next(err); }
};

exports.getAllDeployments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const deployments = await services.getAllDeployments(req.user.user_id);
    return sendSuccess(res, deployments);
  } catch (err) { next(err); }
};

exports.getDeploymentById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const deployment = await services.getDeploymentById(req.params.id);
    if (!deployment) return sendError(res, 'Deployment not found', 404);
    return sendSuccess(res, deployment);
  } catch (err) { next(err); }
};

exports.updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!status) return sendError(res, 'status is required', 400);
    const deployment = await services.updateStatus(req.params.id, status);
    return sendSuccess(res, deployment, `Deployment ${status}`);
  } catch (err) { next(err); }
};
