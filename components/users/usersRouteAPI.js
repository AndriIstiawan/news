const express = require('express');
const UserController = require('./usersController');
const router = express.Router();
const auth = require('../../_helpers/checkUserRequest').checkUserReqGetListAllandUpdateUser;

router.get('/users', auth, UserController.listAll);

router.get('/profile', function (req, res, next) {
    res.send(req.user);
});

router.put('/update-user/:userId', auth, UserController.updateUser);

module.exports = router;
