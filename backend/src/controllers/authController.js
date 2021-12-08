const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  createUser,
  retrieveOneUser,
} = require('../mongodb/models/user/userDao');

const JWT_SECRET =
  'EEA48BE5D0E88895FCD7111FC45DA0B211DC88272D6B16D1FBD01970FEABBC31';

const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORISED = 401;

const AuthenticationFailMsg = {
  status: 'error',
  error: 'Incorrect user credentials',
};

async function register(req, res) {
  const { username, password: plainTextPassword } = req.body;
  const format = /[` !@#$%^&*()+\-=[\]{};':"\\|,.<>\\/?]+/;

  if (!username || typeof username !== 'string' || format.test(username)) {
    return res
      .status(HTTP_BAD_REQUEST)
      .json({ status: 'error', error: 'Invalid username' });
  }

  // unsure no deplicated username
  // later may change to check email field isntead of username
  const existedUsername = await retrieveOneUser(username);

  if (existedUsername) {
    return res
      .status(HTTP_BAD_REQUEST)
      .json({ status: 'error', error: 'Duplicate username' });
  }

  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res
      .status(HTTP_BAD_REQUEST)
      .json({ status: 'error', error: 'Invalid password' });
  }

  if (plainTextPassword.length < 5) {
    return res.status(HTTP_BAD_REQUEST).json({
      status: 'error',
      error: 'Password too small. Should be at least 6 characters',
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  const newUser = await createUser({
    username,
    password,
    transactionDetails: [], // New user will initially have no transactions
  });
  res
    .status(HTTP_CREATED)
    .header('Location', `/api/users/${newUser.id}`)
    .json({ status: 'success' });
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || typeof username !== 'string') {
    return res.status(HTTP_UNAUTHORISED).json(AuthenticationFailMsg);
  }

  if (!password || typeof password !== 'string') {
    return res.status(HTTP_UNAUTHORISED).json(AuthenticationFailMsg);
  }

  const user = await retrieveOneUser(username);

  if (!user) {
    return res.status(HTTP_UNAUTHORISED).json(AuthenticationFailMsg);
  }

  if (await bcrypt.compare(password, user.password)) {
    // generate token based on user id and username
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      JWT_SECRET,
    );

    return res.json({ status: 'success', token });
  }
  return res.status(HTTP_UNAUTHORISED).json(AuthenticationFailMsg);
}

module.exports = {
  register,
  login,
  JWT_SECRET,
};
