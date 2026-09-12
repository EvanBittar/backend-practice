require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

app.get('/', (req, res) => {
  res.json({ message: 'API is running. Try /login, /signup, or /users (auth required).' });
});
app.use('/users', usersRoutes);
app.use('/', authRoutes);

module.exports = app;