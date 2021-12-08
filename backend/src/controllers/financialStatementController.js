/* eslint-disable no-console */
const {
  verifyUser,
  getLowerBoundDateToCompare,
  getTokenFromHeader,
} = require('./util');
const {
  retrieveDetails,
  createTransactionDetail,
  deleteTransactionDetail,
  retrieveOneDetail,
  checkDetailOwner,
  updateOneDetail,
  getSummaryGroupByDate,
  getSummaryGroupByCategory,
  getTotalIncomeByDate,
  getTotalExpenseByDate,
} = require('../mongodb/models/transactionDetail/transactionDetailDao');

const HTTP_UNAUTHORIZE = 401;
const HTTP_FORBIDDEN = 403;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;
const HTTP_NOT_FOUND = 404;
const HTTP_BAD_REQUEST = 400;
const HTTP_INTERNAL_SERVER_ERROR = 500;

async function getFinancialStatement(req, res) {
  const bearerToken = req.headers.authorization;
  const token = getTokenFromHeader(bearerToken);
  let { type } = req.query;
  const { period } = req.query;
  if (!type) {
    type = 'all';
  }

  let userId;
  try {
    userId = verifyUser(token);
  } catch (err) {
    if (err.message === 'Token invalid') {
      return res
        .status(HTTP_FORBIDDEN)
        .json({ success: false, error: err.message });
    }
    return res
      .status(HTTP_UNAUTHORIZE)
      .json({ success: false, error: err.message });
  }

  const lowerBoundDate = getLowerBoundDateToCompare(period);
  const detailList = await retrieveDetails(userId, type, lowerBoundDate);
  return res.json({ success: true, detailList });
}

async function postFinancialStatement(req, res) {
  const bearerToken = req.headers.authorization;
  const token = getTokenFromHeader(bearerToken);
  const { type, date, category, amount, description } = req.body;
  let userId;
  try {
    userId = verifyUser(token);
  } catch (err) {
    if (err.message === 'Token invalid') {
      return res
        .status(HTTP_FORBIDDEN)
        .json({ success: false, error: err.message });
    }
    return res
      .status(HTTP_UNAUTHORIZE)
      .json({ success: false, error: err.message });
  }

  try {
    await createTransactionDetail({
      type,
      date,
      category,
      amount,
      description,
      owner: userId,
    });
    res.sendStatus(HTTP_CREATED);
  } catch (error) {
    res.status(HTTP_FORBIDDEN).json({ status: 'error', error });
  }
}

async function updateFinancialStatement(req, res) {
  const { id } = req.query;
  const bearerToken = req.headers.authorization;
  const token = getTokenFromHeader(bearerToken);
  const { ...detail } = req.body;
  let userId;
  try {
    userId = verifyUser(token);
  } catch (err) {
    const statusCode =
      err.message === 'Token invalid' ? HTTP_FORBIDDEN : HTTP_UNAUTHORIZE;
    return res.status(statusCode).json({ success: false, error: err.message });
  }

  const detailToUpdate = await retrieveOneDetail(id);
  if (!detailToUpdate) {
    return res.sendStatus(HTTP_NOT_FOUND);
  }
  if (!checkDetailOwner(detailToUpdate, userId)) {
    return res.sendStatus(HTTP_FORBIDDEN);
  }

  await updateOneDetail(id, detail);
  return res.sendStatus(HTTP_NO_CONTENT);
}

async function deleteFinancialStatement(req, res) {
  const bearerToken = req.headers.authorization;
  const token = getTokenFromHeader(bearerToken);
  const { detailId } = req.query;
  let userId;
  try {
    userId = verifyUser(token);
  } catch (err) {
    if (err.message === 'Token invalid') {
      return res
        .status(HTTP_FORBIDDEN)
        .json({ success: false, error: err.message });
    }
    return res
      .status(HTTP_UNAUTHORIZE)
      .json({ success: false, error: err.message });
  }

  try {
    const detail = await retrieveOneDetail(detailId);
    if (checkDetailOwner(detail, userId)) {
      await deleteTransactionDetail(detailId);
      res.sendStatus(HTTP_NO_CONTENT);
    } else {
      res
        .status(HTTP_FORBIDDEN)
        .json({ status: 'error', error: 'incorrect owner' });
    }
  } catch (error) {
    res
      .status(HTTP_FORBIDDEN)
      .json({ status: 'error', error: 'invalid detail id' });
  }
}

async function getFinancialStatementTotal(req, res) {
  const { period, type } = req.query;
  const bearerToken = req.headers.authorization;
  const token = getTokenFromHeader(bearerToken);

  let userId;
  try {
    userId = verifyUser(token);
  } catch (err) {
    const statusCode =
      err.message === 'Token invalid' ? HTTP_FORBIDDEN : HTTP_UNAUTHORIZE;
    return res.status(statusCode).json({ success: false, error: err.message });
  }

  const lowerBoundDate = getLowerBoundDateToCompare(period);

  let result;

  try {
    if (type === 'income') {
      const resultArray = await getTotalIncomeByDate(lowerBoundDate, userId);
      result = resultArray[0] ? resultArray[0].totalNumber : 0;
    } else if (type === 'expense') {
      const resultArray = await getTotalExpenseByDate(lowerBoundDate, userId);
      result = resultArray[0] ? resultArray[0].totalNumber : 0;
    } else {
      const totalIncomeArray = await getTotalIncomeByDate(
        lowerBoundDate,
        userId,
      );
      const totalIncome = totalIncomeArray[0]
        ? totalIncomeArray[0].totalNumber
        : 0;
      const totalExpenseArray = await getTotalExpenseByDate(
        lowerBoundDate,
        userId,
      );
      const totalExpense = totalExpenseArray[0]
        ? totalExpenseArray[0].totalNumber
        : 0;
      result = totalIncome - totalExpense;
    }

    return res.json({ success: 'true', result });
  } catch (error) {
    console.log(error);
    return res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .json({ success: false, error });
  }
}

async function getFinancialStatementDailySummary(req, res) {
  const { period } = req.query;
  const bearerToken = req.headers.authorization;
  const token = getTokenFromHeader(bearerToken);
  let userId;
  try {
    userId = verifyUser(token);
  } catch (err) {
    const statusCode =
      err.message === 'Token invalid' ? HTTP_FORBIDDEN : HTTP_UNAUTHORIZE;
    return res.status(statusCode).json({ success: false, error: err.message });
  }
  const lowerBoundDate = getLowerBoundDateToCompare(period);
  const summary = await getSummaryGroupByDate(lowerBoundDate, userId);
  return res.json({ success: true, summary });
}

async function getFinancialStatementCategorySummary(req, res) {
  const { period, type } = req.query;
  const bearerToken = req.headers.authorization;
  const token = getTokenFromHeader(bearerToken);

  let userId;
  try {
    userId = verifyUser(token);
  } catch (err) {
    const statusCode =
      err.message === 'Token invalid' ? HTTP_FORBIDDEN : HTTP_UNAUTHORIZE;
    return res.status(statusCode).json({ success: false, error: err.message });
  }

  if (type !== 'income' && type !== 'expense') {
    return res
      .status(HTTP_BAD_REQUEST)
      .json({ success: false, error: 'invalid type' });
  }

  const lowerBoundDate = getLowerBoundDateToCompare(period);

  try {
    const totalCategory = await getSummaryGroupByCategory(
      lowerBoundDate,
      userId,
      type,
    );
    return res.json({ success: true, summary: totalCategory });
  } catch (error) {
    return res.status(HTTP_FORBIDDEN).json({ success: false, error });
  }
}

module.exports = {
  getFinancialStatement,
  postFinancialStatement,
  updateFinancialStatement,
  deleteFinancialStatement,
  getFinancialStatementTotal,
  getFinancialStatementDailySummary,
  getFinancialStatementCategorySummary,
};
