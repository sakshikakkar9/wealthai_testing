// modules/mutual-fund/routes/mf.routes.js
const express        = require('express');
const router         = express.Router();
const crudCtrl       = require('../controllers/mf.crud.controller');
const navCtrl        = require('../controllers/mf.nav.controller');
const sipCtrl        = require('../controllers/mf.sip.controller');
const authMiddleware = require('../../../shared/middleware/auth.middleware');

// AUTH BYPASS — re-enable for production
// router.use(authMiddleware);

// ── Scheme Master ─────────────────────────────────────────────────
router.get('/schemes',          navCtrl.getSchemes);
router.get('/schemes/:id',      navCtrl.getSchemeById);

// ── NAV ───────────────────────────────────────────────────────────
router.get('/nav/:scheme_id',   navCtrl.getNavHistory);
router.post('/fetch-nav',       navCtrl.fetchNav);
router.post('/parse-nav',       navCtrl.parseNav);

// ── Holdings & Transactions ───────────────────────────────────────
router.get('/holdings',         crudCtrl.getHoldings);
router.post('/holdings/add',    crudCtrl.addHolding);
router.post('/transaction',     crudCtrl.addTransaction);
router.get('/transactions',     crudCtrl.getTransactions);

// ── SIP / STP / SWP ──────────────────────────────────────────────
router.get('/sip/all',          sipCtrl.getSips);
router.post('/sip/add',         sipCtrl.addSip);
router.put('/sip/:id',          sipCtrl.updateSip);
router.delete('/sip/:id',       sipCtrl.cancelSip);

module.exports = router;
