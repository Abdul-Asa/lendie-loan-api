const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const user = process.env.NODE_EMAIL;
const pass = process.env.NODE_PASSWORD;

const transport = nodemailer.createTransport({
  service: 'Outlook',
  auth: {
    user: user,
    pass: pass,
  },
});

const sendConfirmationEmail = (name, email, url) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: 'Please confirm your account',
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Welcome to Lendie. Your account was successfully created. Please confirm your account by clicking on the following link</p>
        <a href=${url}> Click here</a>
        </div>`,
    })
    .catch((err) => console.log(err));
};

module.exports = { sendConfirmationEmail };
