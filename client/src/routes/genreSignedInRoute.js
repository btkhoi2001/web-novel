const express = require('express');
const router = express.Router();

const genreController = require('../controllers/genreController');

router.get('/:id', genreController.homeSignedIn);

module.exports = router;