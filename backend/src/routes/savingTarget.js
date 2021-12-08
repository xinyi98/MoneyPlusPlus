const express = require('express');
const savingTargetController = require('../controllers/savingTargetController');

const router = express.Router();

router.get('/', savingTargetController.getSavingTarget);
router.post('/', savingTargetController.createSavingTarget);
router.delete('/', savingTargetController.deleteSavingTarget);

module.exports = router;
