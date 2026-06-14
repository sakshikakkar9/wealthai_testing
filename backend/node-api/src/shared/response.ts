import { Response } from 'express';

export const sendSuccess = (res: Response, data: any = null, message: string = 'Success', statusCode: number = 200): Response => {
  const payload: any = { success: true, message };
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

export const sendError = (res: Response, message: string = 'Something went wrong', statusCode: number = 500): Response => {
  return res.status(statusCode).json({ success: false, message });
};

// Keeps compatibility with your existing require() calls across 38 files
module.exports = { sendSuccess, sendError };

// // ─────────────────────────────────────────────────────────────────
// //  shared/response.js
// //  Consistent API response helpers
// //  Usage: const { sendSuccess, sendError } = require('../../shared/response');
// //         sendSuccess(res, data, 'Created', 201);
// //         sendError(res, 'Not found', 404);
// // ─────────────────────────────────────────────────────────────────

// const sendSuccess = (res: Response, data: unknown = null, message = 'Success', statusCode = 200): Response => {
//   const payload = { success: true, message };
//   if (data !== null) payload.data = data;
//   return res.status(statusCode).json(payload);
// };

// const sendError = (res: Response, message = 'Something went wrong', statusCode = 500): Response => {
//   return res.status(statusCode).json({ success: false, message });
// };

// module.exports = { sendSuccess, sendError };
