const express = require('express');
const authController = require('../controllers/auth');
const { protect } = require('../middleware/is-auth');

const router = express.Router();

// @route   POST /api/users/auth/login
// @desc    Handle login, auth user
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/users/auth/logout
// @desc    Log user out and clear session
// @access  Private
router.get('/logout', authController.logout);

// @route   GET /api/users/auth/current
// @desc    Get current logged in user
// @access  Private
router.get('/current', protect, authController.getCurrent);

module.exports = router;