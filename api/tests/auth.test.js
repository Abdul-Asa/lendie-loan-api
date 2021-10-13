// const express = require('express');
// const authRoutes = require('../routes/auth.routes');
// const request = require('supertest');
// const app = express();
// const User = require('../models/User');
// const moongose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();

// describe('Testing the authentication routes', () => {
//   moongose
//     .connect(process.env.URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(() => {
//       console.log('connected to db!');
//       setTimeout(() => {
//         moongose.connection.close();
//       }, '8000');
//     })
//     .catch((err) => {
//       console.log(err);
//       moongose.connection.close();
//     });

//   app.use(express.urlencoded({ extended: true }));
//   app.use(express.json());
//   app.use('/', authRoutes);

//   it('Create User - success', async () => {
//     let data = {
//       firstName: 'John',
//       lastName: 'Doe',
//       email: 'johndoe@gmail.com',
//       password: '12345678',
//       hasAgreed: true,
//     };
//     const response = await request(app).post('/signup').send(data);
//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('success');
//   });

//   it('Create User - already exists', async () => {
//     let data = {
//       firstName: 'John',
//       lastName: 'Doe',
//       email: 'johndoe@gmail.com',
//       password: '12345678',
//       hasAgreed: true,
//     };
//     const response = await request(app).post('/signup').send(data);
//     expect(response.status).toBe(500);
//     expect(response.body.message).toBe('Email already exists');
//     await User.deleteOne({
//       email: 'johndoe@gmail.com',
//     });
//   });

//   it('Create User - email validation', async () => {
//     let data = {
//       firstName: 'John',
//       lastName: 'Doe',
//       email: 'johndoe@.com',
//       password: '12345678',
//       hasAgreed: true,
//     };
//     const response = await request(app).post('/signup').send(data);
//     expect(response.status).toBe(400);
//   });

//   it('Create User - password validation', async () => {
//     let data = {
//       firstName: 'John',
//       lastName: 'Doe',
//       email: 'johndoe@gmail.com',
//       password: '12',
//       hasAgreed: true,
//     };
//     const response = await request(app).post('/signup').send(data);
//     expect(response.status).toBe(400);
//   });

//   //Do login and verifyUser routes
// });
