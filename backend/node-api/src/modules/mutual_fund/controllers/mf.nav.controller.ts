// modules/mutual-fund/controllers/mf.nav.controller.js
const services                   = require('../services/mf.nav.services');
const { runPythonScript }        = require('../../../shared/pythonRunner');
const { sendSuccess, sendError } = require('../../../shared/response');

exports.getSchemes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const schemes = await services.getSchemes(req.query);
    return sendSuccess(res, schemes);
  } catch (err) { next(err); }
};

exports.getSchemeById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const scheme = await services.getSchemeById(req.params.id);
    if (!scheme) return sendError(res, 'Scheme not found', 404);
    return sendSuccess(res, scheme);
  } catch (err) { next(err); }
};

exports.getNavHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const nav = await services.getNavHistory(req.params.scheme_id, req.query);
    return sendSuccess(res, nav);
  } catch (err) { next(err); }
};

// POST /api/v1/mf/fetch-nav — triggers Python
exports.fetchNav = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const output = await runPythonScript('mutual_fund/fetch_nav_txt.py');
    return sendSuccess(res, { output }, 'NAV fetch triggered');
  } catch (err) { next(err); }
};

// POST /api/v1/mf/parse-nav — triggers Python
exports.parseNav = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const output = await runPythonScript('mutual_fund/parse_nav_txt.py');
    return sendSuccess(res, { output }, 'NAV parse completed');
  } catch (err) { next(err); }
};
