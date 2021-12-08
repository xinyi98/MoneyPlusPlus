const mongoose = require('mongoose');
const moment = require('moment');

const TransactionDetail = require('./schema');

function checkDetailOwner(detail, userId) {
  return detail.owner.toString() === userId;
}

async function retrieveDetails(userId, type, lowerBoundDate) {
  const filter = {
    owner: mongoose.Types.ObjectId(userId),
    date: { $gte: lowerBoundDate },
  };
  if (type !== 'all') {
    filter.type = type;
  }
  const detailList = await TransactionDetail.find(filter)
    .select('-owner')
    .sort('-date');
  return detailList;
}

async function createTransactionDetail(detail) {
  const dbTransactionDetail = new TransactionDetail(detail);
  await dbTransactionDetail.save();
  return dbTransactionDetail;
}

async function deleteTransactionDetail(id) {
  await TransactionDetail.deleteOne({ _id: id });
}

async function retrieveOneDetail(detailId) {
  const detail = await TransactionDetail.findById(detailId);
  return detail;
}

async function updateOneDetail(detailId, detailToUpdate) {
  const dbDetail = await retrieveOneDetail(detailId);
  dbDetail.category = detailToUpdate.category
    ? detailToUpdate.category
    : dbDetail.category;
  dbDetail.description = detailToUpdate.description
    ? detailToUpdate.description
    : dbDetail.description;
  dbDetail.amount =
    detailToUpdate.amount && detailToUpdate.amount >= 0
      ? detailToUpdate.amount
      : dbDetail.amount;
  await dbDetail.save();
}

async function getSummaryGroupByCategory(startDateMoment, userId, type) {
  const startDate = startDateMoment.toDate();
  const endDate = new Date(moment().local().format('YYYY-MM-DD'));
  const summary = await TransactionDetail.aggregate([
    {
      $match: {
        type,
        owner: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$category',
        totalNumber: { $sum: '$amount' },
      },
    },
    { $project: { _id: 0, category: '$_id', totalNumber: 1 } },
  ]);

  return summary;
}

async function getSummaryGroupByDate(startDateMoment, userId) {
  const startDate = startDateMoment.toDate();
  const endDate = new Date(moment().local().format('YYYY-MM-DD'));
  const detailList = await TransactionDetail.find({
    date: { $gte: startDate, $lte: endDate },
    owner: mongoose.Types.ObjectId(userId),
  });

  const summaryInfo = {};
  detailList.forEach((detail) => {
    const dateString = moment(detail.date).format('YYYY-MM-DD');
    let currentNet = summaryInfo[dateString] || 0;
    if (detail.type === 'income') {
      currentNet += detail.amount;
    } else {
      currentNet -= detail.amount;
    }
    summaryInfo[dateString] = currentNet;
  });
  const summary = [];
  Object.keys(summaryInfo).forEach((date) => {
    summary.push({
      date,
      netIncome: summaryInfo[date],
    });
  });
  // eslint-disable-next-line no-nested-ternary
  summary.sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
  return summary;
}

async function getTotalIncomeByDate(startDateMoment, userId) {
  const startDate = startDateMoment.toDate();
  const endDate = new Date(moment().local().format('YYYY-MM-DD'));
  const totalIncome = await TransactionDetail.aggregate([
    {
      $match: {
        type: 'income',
        owner: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalNumber: { $sum: '$amount' },
      },
    },
    { $project: { _id: 0, totalNumber: 1 } },
  ]);
  return totalIncome;
}

async function getTotalExpenseByDate(startDateMoment, userId) {
  const startDate = startDateMoment.toDate();
  const endDate = new Date(moment().local().format('YYYY-MM-DD'));
  const totalExpense = await TransactionDetail.aggregate([
    {
      $match: {
        type: 'expense',
        owner: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalNumber: { $sum: '$amount' },
      },
    },
    { $project: { _id: 0, totalNumber: 1 } },
  ]);

  return totalExpense;
}

module.exports = {
  createTransactionDetail,
  deleteTransactionDetail,
  checkDetailOwner,
  retrieveDetails,
  retrieveOneDetail,
  updateOneDetail,
  getSummaryGroupByDate,
  getSummaryGroupByCategory,
  getTotalIncomeByDate,
  getTotalExpenseByDate,
};
