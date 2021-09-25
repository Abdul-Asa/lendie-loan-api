const express = require('express');
const router = express.Router();
const {
  loginAction,
  signupAction,
  verifyUser,
} = require('../controllers/auth');

router.post('/signup', signupAction);

router.post('/login', loginAction);

router.get('/confirm/:confirmationCode', verifyUser);

module.exports = router;
