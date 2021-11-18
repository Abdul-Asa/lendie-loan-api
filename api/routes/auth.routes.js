const express = require('express');
const router = express.Router();
const {
  loginAction,
  signupAction,
  verifyUser,
  checkForgotPassword,
  resetPassword,
} = require('../controllers/auth');

router.post('/signup', signupAction);

router.post('/login', loginAction);

router.get('/confirm/:confirmationCode', verifyUser);

router.post('/check-forgot-password', checkForgotPassword);

router.post('/reset-password/:id', resetPassword);

//forgot password
//resend verification code

module.exports = router;
