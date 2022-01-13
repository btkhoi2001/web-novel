const express = require('express');
const router = express.Router();

const accountController = require('../controllers/accountController');

router.get('/follow', accountController.follow);
router.get('/bookmark', accountController.bookmark);
router.get('/', accountController.home);

module.exports = router;