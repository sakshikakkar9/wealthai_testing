// modules/portfolio/routes/portfolio.routes.js
const express        = require('express');
const router         = express.Router();
const ctrl           = require('../controllers/portfolio.controller');
const authMiddleware = require('../../../shared/middleware/auth.middleware');

router.use(authMiddleware);

router.get('/summary',    ctrl.getSummary);
router.get('/allocation', ctrl.getAllocation);
router.get('/pnl',        ctrl.getPnl);

module.exports = router;
