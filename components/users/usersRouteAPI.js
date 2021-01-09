const express = require('express');
const UserController = require('./usersController');
const router = express.Router();

router.get('/users', UserController.listAll);

router.get('/profile', function (req, res, next) {
    res.send(req.user);
});

module.exports = router;
