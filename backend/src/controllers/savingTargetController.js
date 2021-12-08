/* eslint-disable no-console */
const { verifyUser, getTokenFromHeader } = require('./util');
const {
  addTarget,
  getTarget,
  deleteTarget,
} = require('../mongodb/models/savingTarget/savingTargetDao');

async function getSavingTarget(req, res) {
  const bearerToken = req.headers.authorization;
  const token = getTokenFromHeader(bearerToken);
  const { type } = req.query;

  let userId;
  try {
    userId = verifyUser(token);
  } catch (err) {
    if (err.message === 'Token invalid') {
      return res.status(403).json({ success: false, error: err.message });
    }
    return res.status(401).json({ success: false, error: err.message });
  }

  try {
    const target = await getTarget(userId, type);
    const result = target
      ? { targetNumber: target.target, endDate: target.endDate }
      : {};
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
}

async function createSavingTarget(req, res) {
  const bearerToken = req.headers.authorization;
  const token = getTokenFromHeader(bearerToken);
  const { type, endDate, target } = req.body;

  let userId;
  try {
    userId = verifyUser(token);
  } catch (err) {
    if (err.message === 'Token invalid') {
      return res.status(403).json({ success: false, error: err.message });
    }
    return res.status(401).json({ success: false, error: err.message });
  }

  try {
    await addTarget({
      type,
      endDate,
      target: parseInt(target, 10),
      owner: userId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
  return res.sendStatus(201);
}

async function deleteSavingTarget(req, res) {
  const bearerToken = req.headers.authorization;
  const token = getTokenFromHeader(bearerToken);
  const { type } = req.query;

  let userId;
  try {
    userId = verifyUser(token);
  } catch (err) {
    if (err.message === 'Token invalid') {
      return res.status(403).json({ success: false, error: err.message });
    }
    return res.status(401).json({ success: false, error: err.message });
  }

  try {
    await deleteTarget(userId, type);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
  return res.sendStatus(204);
}

module.exports = { createSavingTarget, getSavingTarget, deleteSavingTarget };
