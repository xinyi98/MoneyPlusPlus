const mongoose = require('mongoose');
const SavingTarget = require('./schema');

async function addTarget(target) {
  const dbSavingTarget = new SavingTarget(target);
  await dbSavingTarget.save();
  return dbSavingTarget;
}

async function getTarget(userId, type) {
  const target = await SavingTarget.findOne({
    type,
    owner: mongoose.Types.ObjectId(userId),
  });
  return target || null;
}

async function deleteTarget(userId, type) {
  await SavingTarget.findOneAndDelete({
    type,
    owner: mongoose.Types.ObjectId(userId),
  });
}

module.exports = { addTarget, getTarget, deleteTarget };
