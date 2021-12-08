const express = require('express');
const authRouter = require('./auth');
const financialStatementRouter = require('./financialStatement');
const savingTargetRouter = require('./savingTarget');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/financial-statement', financialStatementRouter);
router.use('/saving-target', savingTargetRouter);

module.exports = router;
