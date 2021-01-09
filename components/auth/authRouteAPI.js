const express = require('express');
const AuthController = require('./authController');
const auth = require('../../_helpers/checkUserRequest').checkUserLogin;

const router = express.Router();

router.post('/register', (req, res) => {
    AuthController.register(req, res);
});

router.post('/login', (req, res, next) => {
    AuthController.login(req, res, next);
});

// request forgot password
router.post('/forgot', (req, res, next) => {
    AuthController.forgot(req, res, next);
});

// create new password
router.post('/reset/:token', (req, res) => {
    AuthController.reset(req, res);
});

module.exports = router;
