// modules/trading-strategy/controllers/strategy.controller.js
const services                   = require('../services/strategy.services');
const { sendSuccess, sendError } = require('../../../shared/response');

exports.addStrategy = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { strategy_name, capital } = req.body;
    if (!strategy_name || !capital) return sendError(res, 'strategy_name and capital are required', 400);
    const strategy = await services.addStrategy({ ...req.body, user_id: req.user.user_id });
    return sendSuccess(res, strategy, 'Strategy created', 201);
  } catch (err) { next(err); }
};

exports.getAllStrategies = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const strategies = await services.getAllStrategies(req.user.user_id);
    return sendSuccess(res, strategies);
  } catch (err) { next(err); }
};

exports.getStrategyById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const strategy = await services.getStrategyById(req.params.id);
    if (!strategy) return sendError(res, 'Strategy not found', 404);
    return sendSuccess(res, strategy);
  } catch (err) { next(err); }
};

exports.updateStrategy = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const strategy = await services.updateStrategy(req.params.id, req.body);
    return sendSuccess(res, strategy, 'Strategy updated');
  } catch (err) { next(err); }
};

exports.deleteStrategy = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await services.deleteStrategy(req.params.id);
    return sendSuccess(res, null, 'Strategy deleted');
  } catch (err) { next(err); }
};

exports.addSet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const set = await services.addSet({ ...req.body, strategy_id: req.params.id });
    return sendSuccess(res, set, 'Set added', 201);
  } catch (err) { next(err); }
};

exports.updateSet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const set = await services.updateSet(req.params.set_id, req.body);
    return sendSuccess(res, set, 'Set updated');
  } catch (err) { next(err); }
};

exports.deleteSet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await services.deleteSet(req.params.set_id);
    return sendSuccess(res, null, 'Set deleted');
  } catch (err) { next(err); }
};

exports.addPosition = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const position = await services.addPosition({ ...req.body, set_id: req.params.set_id });
    return sendSuccess(res, position, 'Position added', 201);
  } catch (err) { next(err); }
};

exports.updatePosition = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const position = await services.updatePosition(req.params.position_id, req.body);
    return sendSuccess(res, position, 'Position updated');
  } catch (err) { next(err); }
};

exports.deletePosition = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await services.deletePosition(req.params.position_id);
    return sendSuccess(res, null, 'Position deleted');
  } catch (err) { next(err); }
};

exports.subscribe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sub = await services.subscribe({ user_id: req.user.user_id, strategy_id: req.params.strategy_id, ...req.body });
    return sendSuccess(res, sub, 'Subscribed to strategy', 201);
  } catch (err) { next(err); }
};

exports.getSubscriptions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const subs = await services.getSubscriptions(req.user.user_id);
    return sendSuccess(res, subs);
  } catch (err) { next(err); }
};
