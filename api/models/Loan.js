const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    activeLoan: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    loanHistory: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Loans', loanSchema);
