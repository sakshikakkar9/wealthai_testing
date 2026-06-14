// modules/bond/routes/bond.routes.js
const express        = require('express');
const router         = express.Router();
const ctrl           = require('../controllers/bond.controller');
const authMiddleware = require('../../../shared/middleware/auth.middleware');

router.use(authMiddleware);

router.get('/master',            ctrl.getBondMaster);
router.post('/add',              ctrl.addHolding);
router.get('/all',               ctrl.getAllHoldings);
router.get('/:id',               ctrl.getHoldingById);
router.put('/update/:id',        ctrl.updateHolding);
router.delete('/delete/:id',     ctrl.deleteHolding);
router.post('/:id/transaction',  ctrl.addTransaction);
router.get('/:id/transactions',  ctrl.getTransactions);

module.exports = router;
