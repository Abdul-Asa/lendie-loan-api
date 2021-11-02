const Loan = require('../models/Loan');
const User = require('../models/User');
// const bcrypt = require('bcryptjs');

const {
  requestLoanValidation,
  repayLoanValidation,
} = require('../helpers/validation');
const dotenv = require('dotenv');
dotenv.config();

const { PAYSTACK_KEY } = process.env;
var paystack = require('paystack')(PAYSTACK_KEY);

const MySecretKey = PAYSTACK_KEY;

// const { sendContactEmail } = require('../helpers/email');

const requestLoan = async (req, res) => {
  try {
    const user_id = req.params.id;
    const existUser = await User.findOne({ _id: user_id });
    if (!existUser) return res.send({ message: "User with id doesn't exist" });

    //validation
    const { error } = requestLoanValidation(req.body);
    if (error) {
      return res.send({
        err: error.details[0],
        message: error.details[0].message,
      });
    }

    //If there's already a loan
    const existLoan = await Loan.findOne({ userId: user_id });
    if (Object.keys(existLoan.activeLoan).length !== 0)
      return res.send({
        loan: existLoan.activeLoan,
        message:
          " You can't request for a loan as because have an active loan already",
      });

    //Store it
    let numWeeks = req.body.time;
    let day = new Date();
    let now = new Date();
    now.setDate(now.getDate() + numWeeks * 7);
    day.setDate(day.getDate());
    const loanReq = {
      ...req.body,
      status: 'Disbursed',
      amountRepaid: 0,
      repaymentDate: now,
      loanTaken: day,
      interest: req.body.amount * 0.025 * (req.body.time / 4),
      totalLoan:
        req.body.amount + req.body.amount * 0.025 * (req.body.time / 4),
    };
    await Loan.updateOne(
      { userId: user_id },
      { $set: { activeLoan: loanReq } },
      { $currentDate: { lastUpdated: true } }
    );

    const activeLoan = await Loan.findOne({ userId: user_id });
    res.json({ message: 'success', history: activeLoan });
  } catch (err) {
    return res.json({ error: err, message: err.message });
  }
};

const deleteLoan = async (req, res) => {
  try {
    const user_id = req.params.id;
    const existUser = await User.findOne({ _id: user_id });
    if (!existUser) return res.send({ message: "User with id doesn't exist" });

    const loanId = req.body.loanId;
    if (!loanId) return res.send({ message: 'No loan Id requested' });
    const existLoan = await Loan.findOne({ _id: loanId });
    if (!existLoan) return res.send({ message: "Loan with id doesn't exist" });

    if (Object.keys(existLoan.activeLoan).length === 0)
      return res.send({
        message: 'No active loans',
      });

    if (existLoan.activeLoan.status !== 'Pending') {
      return res.send({
        message: "You can't delete active or past loans",
      });
    }

    await Loan.updateOne(
      { userId: user_id },
      { $set: { activeLoan: {} } },
      { $currentDate: { lastUpdated: true } }
    );

    const activeLoan = await Loan.findOne({ userId: user_id });
    res.json({ message: 'success', history: activeLoan });
  } catch (err) {
    return res.json({ message: err.message, error: err });
  }
};

const getLoanInfo = async (req, res) => {
  try {
    const user_id = req.params.id;
    const existUser = await User.findOne({ _id: user_id });
    if (!existUser) return res.send({ message: "User with id doesn't exist" });

    //If there's already a loan
    const existLoan = await Loan.findOne({ userId: user_id });
    if (!existLoan)
      return res.send({ message: "User loan history doesn't exist" });

    const activeLoan = await Loan.findOne({ userId: user_id });
    res.json({ message: 'success', loan: activeLoan });
  } catch (err) {
    return res.json({ error: err, message: err.message });
  }
};

const repayLoan = async (req, res) => {
  try {
    const user_id = req.params.id;
    const existUser = await User.findOne({ _id: user_id });
    if (!existUser) return res.send({ message: "User with id doesn't exist" });

    const { error } = repayLoanValidation(req.body);
    if (error) {
      return res.send({
        err: error.details[0],
        message: error.details[0].message,
      });
    }
    const loanId = req.body.loanId;
    if (!loanId) return res.send({ message: 'No loan Id requested' });
    const existLoan = await Loan.findOne({ _id: loanId });
    if (!existLoan) return res.send({ message: "Loan with id doesn't exist" });

    if (Object.keys(existLoan.activeLoan).length === 0)
      return res.send({
        message: 'No active loans',
      });

    const amountPaid = req.body.amountRepaid;
    const amountPayable =
      existLoan.activeLoan.totalLoan - existLoan.activeLoan.amountRepaid;

    paystack.customer
      .create({
        email: existUser.email,
        first_name: existUser.firstName,
        last_name: existUser.lastName,
        key: 'pk_test_12e7967dde543c64a4ece37fb6908224279fe995', // Replace with your public key
      })
      .then((res) => {
        console.log(res);
      });
    paystack.transaction
      .initialize({
        amount: amountPaid,
        authorization_code: MySecretKey,
        email: existUser.email,
      })
      .then((resp) => {
        return res.send({
          message: resp,
        });
      });

    if (amountPaid === amountPayable) {
      const loanInfo = {
        ...existLoan.activeLoan,
        amountRepaid: amountPaid,
        status: 'Repaid',
      };
      await Loan.updateOne(
        { userId: user_id },
        {
          $set: {
            loanHistory: [...existLoan.loanHistory, loanInfo],
            activeLoan: {},
          },
        },
        { $currentDate: { lastUpdated: true } }
      );
      await User.updateOne(
        { _id: user_id },
        { $set: { firstTimeUser: false } },
        { $currentDate: { lastUpdated: true } }
      );
      const activeLoan = await Loan.findOne({ userId: user_id });
      return res.send({
        message: 'Loan has been fully repaid',
        loan: activeLoan,
      });
    }
    if (amountPaid < amountPayable) {
      const loanInfo = {
        ...existLoan.activeLoan,
        amountRepaid: amountPaid + existLoan.activeLoan.amountRepaid,
      };

      await Loan.updateOne(
        { userId: user_id },
        { $set: { activeLoan: loanInfo } },
        { $currentDate: { lastUpdated: true } }
      );
      const activeLoan = await Loan.findOne({ userId: user_id });
      return res.send({
        message: 'Loan has been partially repaid',
        loan: activeLoan,
      });
    }
    if (amountPaid > amountPayable) {
      return res.send({
        message: 'Cannot pay more than loan',
      });
    }
  } catch (err) {
    return res.json({ message: err.message, error: err });
  }
};

module.exports = {
  requestLoan,
  deleteLoan,
  getLoanInfo,
  repayLoan,
};
