// ─────────────────────────────────────────────────────────────────
//  shared/middleware/errorHandler.ts
// ─────────────────────────────────────────────────────────────────
import type { Request, Response, NextFunction } from 'express';   // ← fixes TS2304

import logger from '../logger';

function errorHandler(
  err: Error & { statusCode?: number; code?: string; column?: string },
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(`${req.method} ${req.originalUrl} → ${err.message}`, { stack: err.stack });

  if (err.code === '23505') {
    return res.status(409).json({ success: false, message: 'Record already exists' });
  }
  if (err.code === '23503') {
    return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
  }
  if (err.code === '23502') {
    return res.status(400).json({ success: false, message: `Required field missing: ${err.column}` });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
}

module.exports = errorHandler;
