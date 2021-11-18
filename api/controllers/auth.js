const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Loan = require('../models/Loan');

const {
  signUpValidation,
  loginValidation,
  resetPasswordValidation,
} = require('../helpers/validation');
const { sendConfirmationEmail } = require('../helpers/node.mailer');

const signupAction = async (req, res) => {
  try {
    //validation
    const { error } = signUpValidation(req.body);
    if (error) {
      return res.send({
        err: error.details[0],
        message: error.details[0].message,
      });
    }

    //hash passowrds
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //assign conf. token
    const confirmation = jwt.sign(
      { email: req.body.email },
      process.env.TOKEN_KEY
    );

    // create user
    const user = new User({
      ...req.body,
      password: hashPassword,
      confirmationCode: confirmation,
    });
    const createdUser = await user.save();

    //send conf. code
    let url = '';
    if (process.env.NODE_ENV === 'production') {
      url = `https://lendie-loan-app.vercel.app/auth/confirm/${confirmation}`;
    } else {
      url = `${req.protocol}://localhost:3001/api/auth/confirm/${confirmation}`;
    }
    sendConfirmationEmail(createdUser.firstName, createdUser.email, url);
    res.send({ message: 'success', user: createdUser, link: url });
  } catch (err) {
    if (err.code === 11000) {
      res.send({ message: 'Email already exists' });
    } else {
      res.send({ err, message: err.message });
    }
  }
};

const loginAction = async (req, res) => {
  try {
    //validation
    const { error } = loginValidation(req.body);
    if (error) {
      return res.send({
        err: error.details[0],
        message: error.details[0].message,
      });
    }

    //if user exists
    const existUser = await User.findOne({ email: req.body.email });
    if (!existUser) return res.send({ message: 'Email is not found' });

    //if user hasn't accepted confirmation code
    if (existUser.status != 'Active') {
      return res.send({
        message: 'Pending Account. Please Verify Your Email!',
      });
    }
    //if password is wrong
    const validPassword = await bcrypt.compare(
      req.body.password,
      existUser.password
    );
    if (!validPassword) return res.send({ message: 'Password is wrong' });

    //give token
    const token = jwt.sign(
      { _id: existUser._id, role: existUser.role },
      process.env.TOKEN_KEY
    );

    res
      .header('token', token)
      .json({ message: 'success', token: token, id: existUser._id });
  } catch (err) {
    res.send({ err, message: err.message });
  }
};

const verifyUser = async (req, res, next) => {
  try {
    //find user with the confirmation code
    const existUser = await User.findOne({
      confirmationCode: req.params.confirmationCode,
    });
    if (!existUser) return res.send({ message: 'User not found' });

    //update status to active
    await User.updateOne(
      { confirmationCode: existUser.confirmationCode },
      {
        $set: {
          status: 'Active',
        },
      },
      { $currentDate: { lastUpdated: true } }
    );

    const existHistory = await Loan.findOne({ userId: existUser._id });
    if (!existHistory) {
      const loanHistory = new Loan({
        userId: existUser._id,
      });
      await loanHistory.save();
    }

    //show the new result
    const check = await User.findOne({
      confirmationCode: req.params.confirmationCode,
    });
    res.json({ message: 'success', user: check });
  } catch (err) {
    res.send({ err, message: err.message });
  }
};

const checkForgotPassword = async (req, res) => {
  try {
    //validation
    const { email, dateOfBirth } = req.body;
    if (!email || !dateOfBirth) {
      return res.send({
        message: 'Required field missing',
      });
    }
    //if user exists
    const existUser = await User.findOne({ email: req.body.email });
    if (!existUser) return res.send({ message: 'Email is not found' });

    //if user hasn't accepted confirmation code
    let ode = new Date(existUser.dateOfBirth);
    let ode2 = new Date(dateOfBirth);

    // console.log(ode, ode2);
    if (ode2.getTime() !== ode.getTime()) {
      return res.send({
        message:
          'Date does not match to the date of birth associated with this account',
      });
    }

    res.json({ message: 'success', id: existUser._id });
  } catch (err) {
    res.send({ err, message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const user_id = req.params.id;
    const existUser = await User.findOne({ _id: user_id });
    if (!existUser) return res.send({ message: "User with id doesn't exist" });
    // const { oldPassword, newPassword } = req.body;

    const { error } = resetPasswordValidation(req.body);
    if (error) {
      return res.send({
        err: error.details[0],
        message: error.details[0].message,
      });
    }
    //Move this to validation file

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
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

module.exports = {
  signupAction,
  loginAction,
  verifyUser,
  checkForgotPassword,
  resetPassword,
};
