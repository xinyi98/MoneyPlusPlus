const mongoose = require('mongoose');

const savingTargetSchema = mongoose.Schema({
  type: { type: String, enum: ['longTerm', 'shortTerm'], required: true },
  endDate: { type: Date, required: true },
  target: { type: Number, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const savingTarget = mongoose.model('savingTarget', savingTargetSchema);

module.exports = savingTarget;
