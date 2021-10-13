const Joi = require('@hapi/joi');
//Upgrade the validation schemas

//sign up validation
const signUpValidation = (data) => {
  const validationSchema = Joi.object({
    firstName: Joi.string().required().min(3),
    lastName: Joi.string().required().min(3),
    email: Joi.string().email().required(),
    gender: Joi.string().required(),
    dateOfBirth: Joi.date().required().min(3),
    phoneNumber: Joi.number().required().min(10).max(10),
    password: Joi.string()
      .required()
      .min(8)
      .max(1024)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$')),
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
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
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

const contactValidation = (data) => {
  const validationSchema = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().email().required(),
    message: Joi.string().required().min(8),
  });

  return validationSchema.validate(data);
};

module.exports = {
  signUpValidation,
  loginValidation,
  changePasswordValidation,
  contactValidation,
};
