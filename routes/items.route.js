const express = require('express');
const router = express.Router();

const ItemsController = require('../controllers/items.controller');
const itemsController = new ItemsController();

router.post('/items', itemsController.postItem);

router.get('/items', itemsController.getAllItems);

router.get('/items/:type', itemsController.getItemsByType);

module.exports = router;
