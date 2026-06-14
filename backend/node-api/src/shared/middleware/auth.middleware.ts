import { Request, Response, NextFunction } from 'express';
const jwt    = require('jsonwebtoken');
const logger = require('../logger');

function authMiddleware(req: Request & { user?: any }, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access token missing or malformed' });
    }

    const token   = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // decoded contains: { account_id, user_id, role, iat, exp }
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Access token expired' });
    }
    logger.warn(`Auth failed: ${err.message}`);
    return res.status(401).json({ success: false, message: 'Invalid access token' });
  }
}

module.exports = authMiddleware;
// // ─────────────────────────────────────────────────────────────────
// //  shared/middleware/auth.middleware.js
// //  JWT verification — attach to any protected route
// //  Usage: router.get('/all', authMiddleware, controller.getAll);
// //  Sets req.user = { account_id, user_id, role }
// // ─────────────────────────────────────────────────────────────────

// const jwt    = require('jsonwebtoken');
// const logger = require('../logger');

// function authMiddleware(req: Request & { user?: JwtPayload }, res: Response, next: NextFunction) {
//   try {
//     const authHeader = req.headers['authorization'];
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ success: false, message: 'Access token missing or malformed' });
//     }

//     const token   = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // decoded contains: { account_id, user_id, role, iat, exp }
//     req.user = decoded;
//     next();
//   } catch (err) {
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({ success: false, message: 'Access token expired' });
//     }
//     logger.warn(`Auth failed: ${err.message}`);
//     return res.status(401).json({ success: false, message: 'Invalid access token' });
//   }
// }

// module.exports = authMiddleware;
