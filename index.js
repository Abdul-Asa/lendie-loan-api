const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./api/routes/auth.routes');
const userRoutes = require('./api/routes/user.routes');

const databaseConnection = require('./api/database/database.js');
const port = process.env.PORT || 3000;

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
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

if (process.env.NODE_ENV === 'production') {
  app.get('/', (req, res) => {
    res.send('Loan app api: Production');
  });
} else {
  app.get('/', (req, res) => {
    res.send('Loan app api: Development');
  });
}

app.listen(port, () => {
  console.log('Running on localhost:' + port);
});
