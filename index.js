const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
// const multer = require('multer');
const databaseConnection = require('./api/database/database.js');
const port = process.env.PORT || 3001;
dotenv.config();

//DATABASE
databaseConnection;

//MIDDLEWARE
app.use((req, res, next) => {
  console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//ROUTES
if (process.env.NODE_ENV === 'production') {
  app.get('/', (req, res) => {
    res.send('Production');
  });
} else {
  app.get('/', (req, res) => {
    res.send('Development');
  });
}

app.listen(port, () => {
  console.log('Running on localhost:' + port);
});
