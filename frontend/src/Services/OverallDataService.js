import axios from 'axios';

function getOverallData(period, type, token) {
  const request = axios.get('/api/financial-statement/total', {
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

export function getTotalPeriodData(period, token) {
  const incomeTotalRequest = getOverallData(period, 'income', token);
  const expenseTotalRequest = getOverallData(period, 'expense', token);
  const balanceRequest = getOverallData(period, 'all', token);
  return Promise.all([incomeTotalRequest, expenseTotalRequest, balanceRequest]);
}

export function getOverallBalanceData(token) {
  return getOverallData(null, 'all', token);
}
