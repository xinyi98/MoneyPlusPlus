const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  transactionDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TransactionDetail',
      required: true,
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
