// modules/trading-strategy/routes/strategy.routes.js
const express        = require('express');
const router         = express.Router();
const stratCtrl      = require('../controllers/strategy.controller');
const deployCtrl     = require('../controllers/deployment.controller');
const runsCtrl       = require('../controllers/runs.controller');
const authMiddleware = require('../../../shared/middleware/auth.middleware');

router.use(authMiddleware);

// ── Strategies ────────────────────────────────────────────────────
router.post('/add',                           stratCtrl.addStrategy);
router.get('/all',                            stratCtrl.getAllStrategies);
router.get('/:id',                            stratCtrl.getStrategyById);
router.put('/update/:id',                     stratCtrl.updateStrategy);
router.delete('/delete/:id',                  stratCtrl.deleteStrategy);

// Sets & Positions
router.post('/:id/sets',                      stratCtrl.addSet);
router.put('/sets/:set_id',                   stratCtrl.updateSet);
router.delete('/sets/:set_id',                stratCtrl.deleteSet);
router.post('/sets/:set_id/positions',        stratCtrl.addPosition);
router.put('/positions/:position_id',         stratCtrl.updatePosition);
router.delete('/positions/:position_id',      stratCtrl.deletePosition);

// Subscriptions
router.post('/subscribe/:strategy_id',        stratCtrl.subscribe);
router.get('/subscriptions/all',              stratCtrl.getSubscriptions);

// ── Deployments ───────────────────────────────────────────────────
router.post('/:id/deploy',                    deployCtrl.deploy);
router.get('/deployments/all',                deployCtrl.getAllDeployments);
router.get('/deployments/:id',                deployCtrl.getDeploymentById);
router.put('/deployments/:id/status',         deployCtrl.updateStatus);

// ── Runs & Trade Data ─────────────────────────────────────────────
router.get('/runs/:deployment_id',            runsCtrl.getRunsByDeployment);
router.get('/runs/:run_id/trades',            runsCtrl.getTrades);
router.get('/runs/:run_id/positions',         runsCtrl.getPositions);
router.get('/runs/:run_id/logs',              runsCtrl.getLogs);

module.exports = router;
