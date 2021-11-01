const express = require('express');
const router = express.Router();
// const { profileParser } = require('../database/cloudinary.config');
const { userAuthentication } = require('../helpers/authentication');
const {
  requestLoan,
  deleteLoan,
  getLoanInfo,
  repayLoan,
} = require('../controllers/loan');

router.post('/request-loan/:id', userAuthentication, requestLoan);
router.delete('/delete-loan/:id', userAuthentication, deleteLoan);
router.get('/loan-history/:id', userAuthentication, getLoanInfo);
router.patch('/repay-loan/:id', userAuthentication, repayLoan);
// router.patch('/update/:id', userAuthentication, updateSingleUser);

module.exports = router;
