const User = require('./schema');

async function createUser(user) {
  const dbUser = new User(user);
  await dbUser.save();
  return dbUser;
}

async function retrieveOneUser(name) {
  const dbUser = await User.findOne({ username: name });
  return dbUser;
}

module.exports = {
  createUser,
  retrieveOneUser,
};
