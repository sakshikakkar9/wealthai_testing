// modules/india-market/routes/market.routes.js
const express          = require('express');
const router           = express.Router();
const instrumentsCtrl  = require('../controllers/instruments.controller');
const equityCtrl       = require('../controllers/equity.controller');
const fnoCtrl          = require('../controllers/fno.controller');
const marketdataCtrl   = require('../controllers/marketdata.controller');
const authMiddleware   = require('../../../shared/middleware/auth.middleware');

router.use(authMiddleware);

// ── Instruments ───────────────────────────────────────────────────
router.get('/instruments',              instrumentsCtrl.getInstruments);
router.get('/instruments/:id',          instrumentsCtrl.getInstrumentById);

// ── Equity ────────────────────────────────────────────────────────
router.get('/equity/holdings',          equityCtrl.getHoldings);
router.get('/equity/transactions',      equityCtrl.getTransactions);
router.get('/orders',                   equityCtrl.getOrders);
router.get('/dividends',                equityCtrl.getDividends);
router.get('/corporate-actions',        equityCtrl.getCorporateActions);

// ── F&O ───────────────────────────────────────────────────────────
router.get('/fno/positions',            fnoCtrl.getPositions);
router.get('/fno/transactions',         fnoCtrl.getTransactions);

// ── Market Data ───────────────────────────────────────────────────
router.get('/ohlcv',                    marketdataCtrl.getOhlcv);
router.get('/fii-dii',                  marketdataCtrl.getFiiDii);
router.get('/fii-derivatives',          marketdataCtrl.getFiiDerivatives);
router.get('/options-chain',            marketdataCtrl.getOptionsChain);
router.get('/mmi',                      marketdataCtrl.getMmi);
router.get('/vix',                      marketdataCtrl.getVix);
router.post('/historical',              marketdataCtrl.fetchHistorical);

module.exports = router;
