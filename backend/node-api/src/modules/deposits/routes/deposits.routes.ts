// src/modules/deposits/routes/deposits.routes.ts
import { Router } from 'express';
import {
  getDeposits,
  createDeposit,
  updateDeposit,
  deleteDeposit,
  closeDeposit,
} from '../controllers/deposits.controller';  // ← must match EXACT export names

const router = Router();

router.get('/holdings', getDeposits);
router.post('/holdings', createDeposit);
router.put('/holdings/:id', updateDeposit);
router.delete('/holdings/:id', deleteDeposit);
router.patch('/holdings/:id/close', closeDeposit);

export default router;
// // modules/deposits/routes/deposits.routes.js
// const express        = require('express');
// const router         = express.Router();
// const depositsController           = require('../controllers/deposits.controller');
// const { authMiddleware } = require('../../../shared/middleware/auth.middleware');

// router.use(authMiddleware);
// router.post('/add',                depositsController.addHolding);
// router.get('/all',                 depositsController.getAllHoldings);
// router.get('/:id',                 depositsController.getHoldingById);
// router.put('/update/:id',          depositsController.updateHolding);
// router.delete('/delete/:id',       depositsController.deleteHolding);
// router.post('/:id/transaction',    depositsController.addTransaction);
// router.get('/:id/transactions',    depositsController.getTransactions);

// // module.exports = router;
// export default router;
