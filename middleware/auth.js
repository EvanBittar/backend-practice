require('dotenv').config();
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access denied, no token provided');
  }
  jwt.verify(token, process.env.JWT_SECRET , (err, decode) => {
    if (err) {
      return res.status(403).send('Invalid or expired token');
    }
    req.user = decode;
    next();
  });
}

module.exports = authenticateToken;