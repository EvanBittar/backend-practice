const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authenticateToken = require('../middleware/auth');
const usersController = require('../controllers/usersController');

router.get('/', authenticateToken, usersController.getAllUsers);
router.get('/:id', authenticateToken, usersController.getUserById);

router.post('/', authenticateToken,
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be a valid between 1 and 120'),
    ],
    usersController.createUser
);

router.put('/:id', authenticateToken,
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be a valid between 1 and 120'),
    ],
    usersController.updateUser
);

router.delete('/:id', authenticateToken, usersController.deleteUser);

module.exports = router;