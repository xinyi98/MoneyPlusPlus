import axios from 'axios';

function getDailySummaryData(period, token) {
  const request = axios.get('/api/financial-statement/daily-summary', {
    params: {
      period,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return request;
}

function getCategorySummaryData(period, type, token) {
  const request = axios.get('/api/financial-statement/category-summary', {
    params: {
      period,
      type,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return request;
}

export function getAllChartDataResponse(period, token) {
  const dailySummaryRequest = getDailySummaryData(period, token);
  const incomeCategoryRequest = getCategorySummaryData(period, 'income', token);
  const expenseCategoryRequest = getCategorySummaryData(period, 'expense', token);
  return Promise.all([dailySummaryRequest, incomeCategoryRequest, expenseCategoryRequest]);
}

export function processDailyResponse(res) {
  const { summary } = res.data;
  const newData = { labels: [], datasets: [] };
  const data = [];
  const labels = [];
  summary.forEach((dataObject) => {
    data.push(dataObject.netIncome);
    labels.push(dataObject.date);
  });
  newData.labels = labels;
  newData.datasets.push({
    label: 'Net Income',
    data,
    backgroundColor: ['rgba(252, 186, 3, 0.3)'],
    borderWidth: 1,
  });
  return newData;
}

export function processCategoryResponse(res) {
  const { summary } = res.data;
  const newData = { labels: [], datasets: [] };
  const data = [];
  const labels = [];
  summary.forEach((dataObject) => {
    data.push(dataObject.totalNumber);
    labels.push(dataObject.category);
  });
  newData.labels = labels;
  newData.datasets.push({
    label: 'Category',
    data,
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(89, 45, 217, 0.2)',
    ],
    borderWidth: 1,
  });
  return newData;
}
