// modules/india-market/controllers/instruments.controller.js
const services                   = require('../services/instruments.services');
const { sendSuccess, sendError } = require('../../../shared/response');

exports.getInstruments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { symbol, exchange, instrument_type, segment } = req.query;
    const instruments = await services.getInstruments({ symbol, exchange, instrument_type, segment });
    return sendSuccess(res, instruments);
  } catch (err) { next(err); }
};

exports.getInstrumentById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const instrument = await services.getInstrumentById(req.params.id);
    if (!instrument) return sendError(res, 'Instrument not found', 404);
    return sendSuccess(res, instrument);
  } catch (err) { next(err); }
};
