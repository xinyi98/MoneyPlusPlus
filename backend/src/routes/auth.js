const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

// api/auth/register
router.post('/register', authController.register);

// api/auth/login
router.post('/login', authController.login);

module.exports = router;
