const express = require('express');
const router = express.Router();

const { userAuthentication } = require('../helpers/authentication');
const {
  getSingleUser,
  deleteSingleUser,
  updateSingleUser,
  updateSingleUserPassword,
  // sendCustomerEmail,
} = require('../controllers/user');

router.get('/get-info/:id', userAuthentication, getSingleUser);
router.delete('/delete/:id', userAuthentication, deleteSingleUser);
router.patch('/update/:id', userAuthentication, updateSingleUser);
router.patch(
  '/reset-password/:id',
  userAuthentication,
  updateSingleUserPassword
);
// router.post('/send-email', sendCustomerEmail);

module.exports = router;
