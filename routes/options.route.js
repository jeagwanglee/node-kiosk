const express = require('express');
const router = express.Router();

const OptionsController = require('../controllers/options.controller');
const optionsController = new OptionsController();

router.post('/options', optionsController.postOption);

module.exports = router;
