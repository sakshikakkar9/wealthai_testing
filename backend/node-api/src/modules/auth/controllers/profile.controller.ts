// ─────────────────────────────────────────────────────────────────
//  modules/auth/controllers/profile.controller.js
//  Handles user profiles and broker accounts
// ─────────────────────────────────────────────────────────────────

const profileServices            = require('../services/profile.services');
const { sendSuccess, sendError } = require('../../../shared/response');

// ── User Profiles ─────────────────────────────────────────────────

exports.addUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { profile_name } = req.body;
    if (!profile_name) return sendError(res, 'profile_name is required', 400);
    const user = await profileServices.addUser({ ...req.body, account_id: req.user.account_id });
    return sendSuccess(res, user, 'User profile created', 201);
  } catch (err) { next(err); }
};

exports.getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await profileServices.getUsersByAccount(req.user.account_id);
    return sendSuccess(res, users);
  } catch (err) { next(err); }
};

exports.updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await profileServices.updateUser(req.params.id, req.body);
    if (!user) return sendError(res, 'User profile not found', 404);
    return sendSuccess(res, user, 'User profile updated');
  } catch (err) { next(err); }
};

exports.deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await profileServices.deleteUser(req.params.id);
    return sendSuccess(res, null, 'User profile deleted');
  } catch (err) { next(err); }
};

// ── Broker Accounts ───────────────────────────────────────────────

exports.addBroker = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { broker_name, account_number } = req.body;
    if (!broker_name || !account_number) {
      return sendError(res, 'broker_name and account_number are required', 400);
    }
    const broker = await profileServices.addBroker({ ...req.body, user_id: req.user.user_id });
    return sendSuccess(res, broker, 'Broker account linked', 201);
  } catch (err) { next(err); }
};

exports.getBrokers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const brokers = await profileServices.getBrokersByUser(req.user.user_id);
    return sendSuccess(res, brokers);
  } catch (err) { next(err); }
};

exports.updateBroker = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const broker = await profileServices.updateBroker(req.params.id, req.body);
    if (!broker) return sendError(res, 'Broker account not found', 404);
    return sendSuccess(res, broker, 'Broker account updated');
  } catch (err) { next(err); }
};

exports.deleteBroker = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await profileServices.deleteBroker(req.params.id);
    return sendSuccess(res, null, 'Broker account removed');
  } catch (err) { next(err); }
};
