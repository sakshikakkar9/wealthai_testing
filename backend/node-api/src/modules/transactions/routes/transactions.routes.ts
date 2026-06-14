const express = require('express');
const router = express.Router();
const portfolioServices = require('../../portfolio/services/portfolio.services');
const authMiddleware = require('../../../shared/middleware/auth.middleware');

router.use(authMiddleware);

router.get('/all', async (req, res) => {
  try {
    const transactions = await portfolioServices.getAllTransactions(req.user.user_id);
    res.json({ success: true, data: transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
