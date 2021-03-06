const express = require('express');
const router = express.Router();
const { profileParser } = require('../database/cloudinary.config');
const { userAuthentication } = require('../helpers/authentication');
const {
  getSingleUser,
  deleteSingleUser,
  updateSingleUser,
  updateSingleUserPassword,
  updateSingleUserPayment,
  // sendCustomerEmail,
  updateProfilePic,
} = require('../controllers/user');

router.get('/get-info/:id', userAuthentication, getSingleUser);
router.delete('/delete/:id', userAuthentication, deleteSingleUser);
router.patch('/update/:id', userAuthentication, updateSingleUser);
router.patch(
  '/reset-password/:id',
  userAuthentication,
  updateSingleUserPassword
);
router.patch(
  '/update-payment/:id',
  userAuthentication,
  updateSingleUserPayment
);
router.patch(
  '/profile-pic/:id',
  profileParser.single('image'),
  updateProfilePic
);

module.exports = router;
