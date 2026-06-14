// modules/mutual-fund/controllers/mf.sip.controller.js
const services                   = require('../services/mf.sip.services');
const { sendSuccess, sendError } = require('../../../shared/response');

exports.getSips = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sips = await services.getSips(req.user.user_id);
    return sendSuccess(res, sips);
  } catch (err) { next(err); }
};

exports.addSip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { scheme_id, plan_type, amount, frequency, start_date } = req.body;
    if (!scheme_id || !plan_type || !amount || !frequency || !start_date) {
      return sendError(res, 'scheme_id, plan_type, amount, frequency and start_date are required', 400);
    }
    const sip = await services.addSip({ ...req.body, user_id: req.user.user_id });
    return sendSuccess(res, sip, 'SIP created', 201);
  } catch (err) { next(err); }
};

exports.updateSip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sip = await services.updateSip(req.params.id, req.body);
    if (!sip) return sendError(res, 'SIP not found', 404);
    return sendSuccess(res, sip, 'SIP updated');
  } catch (err) { next(err); }
};

exports.cancelSip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await services.cancelSip(req.params.id);
    return sendSuccess(res, null, 'SIP cancelled');
  } catch (err) { next(err); }
};
