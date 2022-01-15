const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/genre/create', adminController.genreCreate);

router.get('/genre', adminController.genre);

router.get('/user/create', adminController.userCreate);

router.get('/user', adminController.user);

router.get('/novel/create', adminController.novelCreate);

router.get('/novel', adminController.novel);

module.exports = router;