const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: { unique: true },
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'P/N'],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
    },
    hasAgreed: {
      type: Boolean,
      default: false,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Active'],
      default: 'Pending',
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    firstTimeUser: {
      type: Boolean,
      default: true,
    },
    saveCard: {
      type: Boolean,
      default: true,
    },
    saveDetails: {
      type: Boolean,
      default: true,
    },
    confirmationCode: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
    },
    BVN: {
      type: String,
      trim: true,
    },
    NIN: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    accountName: {
      type: String,
    },
    bankName: {
      type: String,
      trim: true,
    },
    cardNumber: {
      type: String,
      trim: true,
    },
    cardHolder: {
      type: String,
    },
    CVV: {
      type: String,
      trim: true,
    },
    expiryDate: {
      type: Date,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Users', userSchema);
