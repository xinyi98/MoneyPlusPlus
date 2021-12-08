import axios from 'axios';

function getTransactionData(type, period, token) {
  const request = axios.get('/api/financial-statement', {
    params: {
      type,
      period,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return request;
}

function deleteTransactionData(detailId, token) {
  const request = axios.delete('/api/financial-statement', {
    params: {
      detailId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return request;
}

export function getAllTransactions(token) {
  return getTransactionData('', 'last_week', token);
}

export function getTransactionsWithinPeriod(period, token) {
  return getTransactionData('', period, token);
}

export function deleteTransaction(id, token) {
  return deleteTransactionData(id, token);
}
