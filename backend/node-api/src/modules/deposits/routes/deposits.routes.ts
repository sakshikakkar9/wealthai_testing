// src/modules/deposits/routes/deposits.routes.ts
const { Router } = require('express');
const {
  getDeposits,
  createDeposit,
  updateDeposit,
  deleteDeposit,
  closeDeposit,
} = require('../controllers/deposits.controller');

const router = Router();

router.get('/holdings', getDeposits);
router.post('/holdings', createDeposit);
router.put('/holdings/:id', updateDeposit);
router.delete('/holdings/:id', deleteDeposit);
router.patch('/holdings/:id/close', closeDeposit);

module.exports = router;
