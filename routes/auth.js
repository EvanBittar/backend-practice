
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');


router.post('/signup',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be a valid between 1 and 120'),
        body('password').notEmpty().isLength({ min: 8 }).withMessage('Password must be at least 8 character')
    ],
    authController.signup
);

router.post('/login',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('password').notEmpty().isLength({ min: 8 }).withMessage('Password is required')
    ],
    authController.login
);

module.exports = router;