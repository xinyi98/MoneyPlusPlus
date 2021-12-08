/* eslint-disable no-console */
const mongoose = require('mongoose');

const connectionString = encodeURI(process.env.MONGODB_CLUSTER_URL);

// Start the DB running. Then, once it's connected, start the server.
// The database name is MoneyPlusPlus
function connect() {
  mongoose.connect(
    connectionString,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Successfully connected to MongoDB cluster');
      }
    },
  );
}

module.exports = { connect };
