const jwt = require('jsonwebtoken');
const moment = require('moment');

const JWT_SECRET =
  'EEA48BE5D0E88895FCD7111FC45DA0B211DC88272D6B16D1FBD01970FEABBC31';

function getTokenFromHeader(bearerToken) {
  if (bearerToken != null) {
    const bearer = bearerToken.split(' ');
    const token = bearer[1];
    return token;
  }
  return null;
}

function verifyUser(token) {
  if (!token || typeof token !== 'string') {
    throw Error('No token provided');
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    return user.id;
  } catch (error) {
    throw Error('Token invalid');
  }
}

function getLowerBoundDateToCompare(period) {
  let lowerBoundDate = moment();
  if (period === 'last_week') {
    lowerBoundDate.subtract(1, 'weeks');
  } else if (period === 'last_month') {
    lowerBoundDate.subtract(1, 'months');
  } else if (period === 'last_three_months') {
    lowerBoundDate.subtract(3, 'months');
  } else if (period === 'last_six_months') {
    lowerBoundDate.subtract(6, 'months');
  } else if (period === 'last_year') {
    lowerBoundDate.subtract(1, 'years');
  } else {
    lowerBoundDate = moment('1970-01-01');
  }
  return lowerBoundDate;
}

module.exports = { verifyUser, getLowerBoundDateToCompare, getTokenFromHeader };
