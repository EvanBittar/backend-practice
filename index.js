const express = require('express');
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { decode } = require('punycode');

const app = express();
app.use(express.json());

const PORT = process.env.PORT;
const JWT_SECRT = process.env.JWT_SECRET;
const { body, validationResult } = require("express-validator");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access denied, no token provided');
  }
  jwt.verify(token, JWT_SECRT, (err, decode) => {
    if (err) {
      return res.status(403).send('Invalid or expired token');
    }
    req.user = decode;
    next();
  });
}


app.get('/users', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, age FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    const [row] = await pool.query('SELECT name, age FROM users WHERE id = ?', [req.params.id]);
    if (row.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(row[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/users', authenticateToken,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be a vaild number between 1 and 120')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { name, age } = req.body;
      const [result] = await pool.query('INSERT INTO users (name, age) VALUES (?, ?)', [name, age]);
      res.status(201).json({ id: result.insertId, name, age });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

app.put('/users/:id', authenticateToken,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be a vaild number between 1 and 120')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { name, age } = req.body;
      const [result] = await pool.query('UPDATE users SET name = ? , age = ? WHERE id = ?', [name, age, req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).send();
      }
      res.status(200).json({ message: 'Updated successfully' });
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  });

app.delete('/users/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);;
    if (result.affectedRows === 0) {
      return res.status(404).send()
    }
    return res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be a vaild number between 1 and 120'),
    body('password').trim().isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
      const { name, age, password } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.query('INSERT INTO users (name, age , password) VALUES (?, ?, ?)', [name, age, hashPassword]);
      res.status(201).json({ id: result.insertId, name, age });
    } catch (err) {
      console.log(err);
      res.status(500).send('Failed to sign up');
    }
  });

app.post('/login',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { name, password } = req.body;
      const [rows] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);
      if (rows.length === 0) {
        return res.status(401).send('Invalid credentials');
      }
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).send('Invalid credentials');
      }

      const token = jwt.sign({ userId: user.id, name: user.name }, JWT_SECRT, { expiresIn: '1h' });
      res.json({ message: 'Login Successful', token });
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  });



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
