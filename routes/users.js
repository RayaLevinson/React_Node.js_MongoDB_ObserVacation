const express = require('express');
const usersController = require('../controllers/users');

const router = express.Router();

//@route    GET /api/users
//@desc     Get users
//@acceess  Public
router.get('/', usersController.getUsers);

//@route    POST /api/users
//@desc     Create a new user
//@acceess  Public
router.post('/', usersController.registerUser);

module.exports = router;
