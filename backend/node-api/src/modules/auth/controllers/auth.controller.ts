// ─────────────────────────────────────────────────────────────────
//  modules/auth/controllers/auth.controller.js
//  Handles login, register, token management
// ─────────────────────────────────────────────────────────────────

const authServices          = require('../services/auth.services');
const { sendSuccess, sendError } = require('../../../shared/response');

exports.register = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, full_name } = req.body;
    if (!username || !email || !password) {
      return sendError(res, 'username, email and password are required', 400);
    }
    const account = await authServices.register({ username, email, password, full_name });
    return sendSuccess(res, account, 'Account created successfully', 201);
  } catch (err) { next(err); }
};

exports.login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return sendError(res, 'email and password are required', 400);
    const result = await authServices.login({ email, password });
    return sendSuccess(res, result, 'Login successful');
  } catch (err) { next(err); }
};

exports.logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await authServices.logout(req.user.account_id);
    return sendSuccess(res, null, 'Logged out successfully');
  } catch (err) { next(err); }
};

exports.refreshToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return sendError(res, 'refresh_token is required', 400);
    const result = await authServices.refreshToken(refresh_token);
    return sendSuccess(res, result, 'Token refreshed');
  } catch (err) { next(err); }
};

exports.getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const account = await authServices.getAccountById(req.user.account_id);
    return sendSuccess(res, account);
  } catch (err) { next(err); }
};
