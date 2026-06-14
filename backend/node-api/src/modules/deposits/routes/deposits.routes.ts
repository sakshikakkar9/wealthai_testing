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

// AUTH BYPASS — re-enable for production
// router.get('/holdings', getDeposits);
router.get('/holdings', getDeposits);
router.post('/holdings', createDeposit);
router.put('/holdings/:id', updateDeposit);
router.delete('/holdings/:id', deleteDeposit);
router.patch('/holdings/:id/close', closeDeposit);

module.exports = router;
