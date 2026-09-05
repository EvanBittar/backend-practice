const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { body, validationResult } = require("express-validator");

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, age FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT name, age FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, age } = req.body;
    const [result] = await pool.query('INSERT INTO users (name, age) VALUES (?, ?)', [name, age]);
    res.status(201).json({ id: result.insertId, name, age });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, age } = req.body;
    const [result] = await pool.query('UPDATE users SET name = ? , age = ? WHERE id = ?', [name, age, req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).send();

    return res.status(200).json({ message: 'Updated successfully' });

  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).send();
    return res.status(200).json({ message: 'Deleted successfully' });

  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};