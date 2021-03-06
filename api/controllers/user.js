const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {
  changePasswordValidation,
  paymentInfoValidation,
  personalInfoValidation,
  // contactValidation,
} = require('../helpers/validation');
var luhn = require('luhn');
// const { sendContactEmail } = require('../helpers/email');

const getSingleUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const existUser = await User.findOne({ _id: user_id });
    if (!existUser) return res.send({ message: "User with id doesn't exist" });
    res.json({ message: 'success', user: existUser });
  } catch (err) {
    return res.json({ error: err, message: err.message });
  }
};

const deleteSingleUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const existUser = await User.findOne({ _id: user_id });
    if (!existUser) return res.send({ message: "User with id doesn't exist" });
    const deletedUser = await User.deleteOne({ _id: user_id });
    res.json({ message: 'success', user: deletedUser });
  } catch (err) {
    return res.json({ message: err.message, error: err });
  }
};

const updateSingleUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const existUser = await User.findOne({ _id: user_id });
    if (!existUser) return res.send({ message: "User with id doesn't exist" });

    const { error } = personalInfoValidation(req.body);
    if (error) {
      return res.send({
        err: error.details[0],
        message: error.details[0].message,
      });
    }

    const keyObj = Object.keys(req.body);
    const updatedFields = {};
    keyObj.map(async (index) => {
      if (index === 'password') {
        return res.json({ message: "Can't update password on this route" });
      }
      updatedFields[index] = req.body[index];
    });

    const updatedUser = await User.updateOne(
      { _id: user_id },
      { $set: updatedFields },
      { $currentDate: { lastUpdated: true } }
    );
    res.json({ message: 'success', user: updatedUser });
  } catch (err) {
    return res.json({ message: err.message, error: err });
  }
};

const updateSingleUserPassword = async (req, res) => {
  try {
    const user_id = req.params.id;
    const existUser = await User.findOne({ _id: user_id });
    if (!existUser) return res.send({ message: "User with id doesn't exist" });
    // const { oldPassword, newPassword } = req.body;

    const { error } = changePasswordValidation(req.body);
    if (error) {
      return res.send({
        err: error.details[0],
        message: error.details[0].message,
      });
    }
    //Move this to validation file
    const validPassword = await bcrypt.compare(
      req.body.oldPassword,
      existUser.password
    );
    if (!validPassword) return res.send({ message: 'Old password is wrong' });
    if (req.body.oldPassword === req.body.newPassword)
      return res.send({ message: 'You must enter a different password' });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.newPassword, salt);
    const updatedUser = await User.updateOne(
      { _id: user_id },
      { $set: { password: hashPassword } },
      { $currentDate: { lastUpdated: true } }
    );
    res.json({ message: 'success', user: updatedUser });
  } catch (err) {
    return res.json({ message: err.message, error: err });
  }
};

const updateProfilePic = async (req, res) => {
  try {
    const user_id = req.params.id;
    const existUser = await User.findOne({ _id: user_id });
    if (!existUser) return res.send("User with id doesn't exist");

    const image = req.file.path;

    const updatedUser = await User.updateOne(
      { _id: user_id },
      { $set: { image: image } },
      { $currentDate: { lastUpdated: true } }
    );
    res.json({ message: 'success', user: updatedUser });
  } catch (err) {
    return res.json({ message: err.message, error: err });
  }
};

const updateSingleUserPayment = async (req, res) => {
  try {
    const user_id = req.params.id;
    const existUser = await User.findOne({ _id: user_id });
    if (!existUser) return res.send({ message: "User with id doesn't exist" });

    const { error } = paymentInfoValidation(req.body);
    if (error) {
      return res.send({
        err: error.details[0],
        message: error.details[0].message,
      });
    }

    var is_valid = luhn.validate(req.body.cardNumber);
    if (!is_valid) return res.send({ message: 'Card number is not valid' });

    const keyObj = Object.keys(req.body);
    const updatedFields = {};
    keyObj.map(async (index) => {
      if (index === 'password') {
        return res.json({ message: "Can't update password on this route" });
      }
      updatedFields[index] = req.body[index];
    });

    await User.updateOne(
      { _id: user_id },
      { $set: updatedFields },
      { $currentDate: { lastUpdated: true } }
    );
    const savedCard = await User.updateOne(
      { _id: user_id },
      { $set: { saveCard: true } },
      { $currentDate: { lastUpdated: true } }
    );
    res.json({ message: 'success', user: savedCard });
  } catch (err) {
    return res.json({ message: err.message, error: err });
  }
};

module.exports = {
  getSingleUser,
  deleteSingleUser,
  updateSingleUser,
  updateSingleUserPassword,
  updateProfilePic,
  updateSingleUserPayment,
};
