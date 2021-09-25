const moongose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const databaseConnection = moongose
  .connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to db!');
  })
  .catch((err) => {
    console.log(err);
    databaseConnection.close();
  });

module.exports = databaseConnection;
