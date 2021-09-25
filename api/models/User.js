const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
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

    phoneNumber: {
      type: String,
      trim: true,
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
    confirmationCode: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Users', userSchema);
