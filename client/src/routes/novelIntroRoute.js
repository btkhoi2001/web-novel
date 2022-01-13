const express = require('express');
const router = express.Router();

const novelIntroController = require('../controllers/novelIntroController');

router.get('/:id', novelIntroController.home);

router.get('/:id/chapter/:chapterId', novelIntroController.chapter);

module.exports = router;