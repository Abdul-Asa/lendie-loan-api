const Joi = require('@hapi/joi');
//Upgrade the validation schemas

//sign up validation
const signUpValidation = (data) => {
  const now = Date.now();
  const cutoffDate = new Date(now - 1000 * 60 * 60 * 24 * 365 * 21);
  const validationSchema = Joi.object({
    firstName: Joi.string().required().min(3),
    lastName: Joi.string().required().min(3),
    email: Joi.string().email().required(),
    gender: Joi.string().required(),
    dateOfBirth: Joi.date().max(cutoffDate).required(),
    phoneNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    password: Joi.string()
      .required()
      .min(8)
      .max(1024)
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{3,1024}$')),
    confirmPassword: Joi.ref('password'),
    hasAgreed: Joi.boolean().required().invalid(false),
  });

  return validationSchema.validate(data);
};

const loginValidation = (data) => {
  const validationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .required()
      .min(8)
      .max(1024)
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{3,1024}$')),
  });

  return validationSchema.validate(data);
};

const changePasswordValidation = (data) => {
  const validationSchema = Joi.object({
    oldPassword: Joi.string()
      .required()
      .min(8)
      .max(1024)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$')),
    newPassword: Joi.string()
      .required()
      .min(8)
      .max(1024)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$')),
  });

  return validationSchema.validate(data);
};

const personalInfoValidation = (data) => {
  const validationSchema = Joi.object({
    firstName: Joi.string().required().min(3),
    lastName: Joi.string().required().min(3),
    phoneNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    address: Joi.string().required(),
    NIN: Joi.string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required(),
    BVN: Joi.string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required(),
    saveDetails: Joi.boolean(),
  });

  return validationSchema.validate(data);
};

const paymentInfoValidation = (data) => {
  const validationSchema = Joi.object({
    cardNumber: Joi.string()
      .length(16)
      .pattern(/^[0-9]+$/)
      .required(),
    cardHolder: Joi.string().required().min(3),
    CVV: Joi.string()
      .length(3)
      .pattern(/^[0-9]+$/)
      .required(),
    expiryDate: Joi.string().required(),
    accountNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    accountName: Joi.string().required().min(3),
    bankName: Joi.string().required().min(3),
  });

  return validationSchema.validate(data);
};

const requestLoanValidation = (data) => {
  const validationSchema = Joi.object({
    amount: Joi.number().required(),
    time: Joi.number().required().max(12).min(1),
    purpose: Joi.string().required(),
  });

  return validationSchema.validate(data);
};

const repayLoanValidation = (data) => {
  const validationSchema = Joi.object({
    amountRepaid: Joi.number().required(),
    loanId: Joi.string().required(),
  });

  return validationSchema.validate(data);
};

const resetPasswordValidation = (data) => {
  const validationSchema = Joi.object({
    password: Joi.string()
      .required()
      .min(8)
      .max(1024)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$')),
    resetPassword: Joi.string()
      .required()
      .min(8)
      .max(1024)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$')),
  });

  return validationSchema.validate(data);
};

module.exports = {
  signUpValidation,
  loginValidation,
  changePasswordValidation,
  paymentInfoValidation,
  personalInfoValidation,
  requestLoanValidation,
  repayLoanValidation,
  resetPasswordValidation,
};
