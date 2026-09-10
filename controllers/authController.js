// const express = require('express');
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const { name, age, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query('INSERT INTO users (name, age, Password) VALUES (?,?,?)', [name, age, hashPassword]);
        res.status(201).json({ id: result.insertId, name, age });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to sign up' });
    }
};

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, password } = req.body;
        const [rows] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login Successful', token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to log in' });
    }
};