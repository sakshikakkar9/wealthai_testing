// modules/india-market/controllers/marketdata.controller.js
const services                   = require('../services/marketdata.services');
const { runPythonScript }        = require('../../../shared/pythonRunner');
const { sendSuccess, sendError } = require('../../../shared/response');

exports.getOhlcv = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { instrument_id, timeframe, from, to, limit } = req.query;
    if (!instrument_id || !timeframe) {
      return sendError(res, 'instrument_id and timeframe are required', 400);
    }
    const data = await services.getOhlcv({ instrument_id, timeframe, from, to, limit });
    return sendSuccess(res, data);
  } catch (err) { next(err); }
};

exports.getFiiDii = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await services.getFiiDii(req.query);
    return sendSuccess(res, data);
  } catch (err) { next(err); }
};

exports.getFiiDerivatives = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await services.getFiiDerivatives(req.query);
    return sendSuccess(res, data);
  } catch (err) { next(err); }
};

exports.getOptionsChain = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { instrument_id, expiry_date } = req.query;
    if (!instrument_id || !expiry_date) {
      return sendError(res, 'instrument_id and expiry_date are required', 400);
    }
    const data = await services.getOptionsChain(req.query);
    return sendSuccess(res, data);
  } catch (err) { next(err); }
};

exports.getMmi = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await services.getMmi();
    return sendSuccess(res, data);
  } catch (err) { next(err); }
};

exports.getVix = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await services.getVix(req.query);
    return sendSuccess(res, data);
  } catch (err) { next(err); }
};

// POST /api/v1/market/historical — triggers Python
exports.fetchHistorical = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { ticker, from, to, timeframe } = req.body;
    if (!ticker || !from || !to) {
      return sendError(res, 'ticker, from and to are required', 400);
    }
    const output = await runPythonScript('market_data/ohlcv_fetcher.py', [
      '--ticker',    ticker,
      '--from',      from,
      '--to',        to,
      '--timeframe', timeframe || '1d',
    ]);
    return sendSuccess(res, { output }, 'Historical data fetch triggered');
  } catch (err) { next(err); }
};
