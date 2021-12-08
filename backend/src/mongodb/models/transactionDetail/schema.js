/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const transactionDetailSchema = mongoose.Schema({
  type: { type: String, enum: ['income', 'expense'], required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

transactionDetailSchema.set('toJSON', {
  transform(_, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

const TransactionDetail = mongoose.model(
  'TransactionDetail',
  transactionDetailSchema,
);

module.exports = TransactionDetail;
