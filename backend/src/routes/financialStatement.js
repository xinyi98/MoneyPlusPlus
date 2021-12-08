const express = require('express');

const financialStatementController = require('../controllers/financialStatementController');

const router = express.Router();

// GET api/financial-statement
router.get('/', financialStatementController.getFinancialStatement);

// POST api/financial-statement
router.post('/', financialStatementController.postFinancialStatement);

// PUT api/financial-statement
router.put('/', financialStatementController.updateFinancialStatement);

// DELETE api/financial-statement
router.delete('/', financialStatementController.deleteFinancialStatement);

// GET api/financial-statement/total
router.get('/total', financialStatementController.getFinancialStatementTotal);

// GET api/financial-statement/daily-summary
router.get(
  '/daily-summary',
  financialStatementController.getFinancialStatementDailySummary,
);

// GET api/financial-statement/category-summary
router.get(
  '/category-summary',
  financialStatementController.getFinancialStatementCategorySummary,
);

module.exports = router;
