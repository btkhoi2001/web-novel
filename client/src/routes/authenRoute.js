const express = require('express');
const router = express.Router();

const authenController = require('../controllers/authenController');

router.get('/', authenController.home);

module.exports = router;