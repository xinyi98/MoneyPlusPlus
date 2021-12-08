import axios from 'axios';

export function getSavingTarget(token, type) {
  const request = axios.get('/api/saving-target', {
    params: { type },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return request;
}

export function getBothSavingTarget(token) {
  const shortTermRequest = getSavingTarget(token, 'shortTerm');
  const longTermRequest = getSavingTarget(token, 'longTerm');
  return Promise.all([shortTermRequest, longTermRequest]);
}

export function setSavingTarget(token, type, date, targetAmount) {
  const request = axios.post(
    '/api/saving-target',
    {
      type,
      endDate: date,
      target: targetAmount,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return request;
}

export function deleteSavingTarget(token, type) {
  const request = axios.delete('/api/saving-target', {
    params: { type },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return request;
}
