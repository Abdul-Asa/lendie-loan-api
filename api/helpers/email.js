// const { send } = require('emailjs-com');
// const dotenv = require('dotenv');
// dotenv.config();

// const template = process.env.EMAILJS_TEMPLATE;
// const service = process.env.EMAILJS_SERVICE;
// const user = process.env.EMAILJS_USER;

// const sendContactEmail = (name, email, message) => {
//   let templateParams = {
//     from_name: name,
//     from_email: email,
//     to_name: 'Lendie customer Service ',
//     message: message,
//   };

//   send(service, template, templateParams, user)
//     .then((response) => {
//       console.log(response);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   console.log('reaches here 2');
// };

// module.exports = { sendContactEmail };
