// ─────────────────────────────────────────────────────────────────
//  modules/auth/routes/auth.routes.js
// ─────────────────────────────────────────────────────────────────

const express        = require('express');
const router         = express.Router();
const authCtrl       = require('../controllers/auth.controller');
const profileCtrl    = require('../controllers/profile.controller');
const authMiddleware = require('../../../shared/middleware/auth.middleware');

// ── Public (no JWT) ───────────────────────────────────────────────
router.post('/register',        authCtrl.register);
router.post('/login',           authCtrl.login);
router.post('/refresh',         authCtrl.refreshToken);

// ── Protected ─────────────────────────────────────────────────────
router.post('/logout',          authMiddleware, authCtrl.logout);
router.get('/me',               authMiddleware, authCtrl.getMe);

// User profiles
router.post('/users',           authMiddleware, profileCtrl.addUser);
router.get('/users',            authMiddleware, profileCtrl.getUsers);
router.put('/users/:id',        authMiddleware, profileCtrl.updateUser);
router.delete('/users/:id',     authMiddleware, profileCtrl.deleteUser);

// Broker accounts
router.post('/brokers',         authMiddleware, profileCtrl.addBroker);
router.get('/brokers',          authMiddleware, profileCtrl.getBrokers);
router.put('/brokers/:id',      authMiddleware, profileCtrl.updateBroker);
router.delete('/brokers/:id',   authMiddleware, profileCtrl.deleteBroker);

module.exports = router;
