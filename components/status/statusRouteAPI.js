const express = require('express');
const StatusController = require('./statusController');
const router = express.Router();

router.post('/status', StatusController.create);

router.get('/status', StatusController.findAll);

module.exports = router;
