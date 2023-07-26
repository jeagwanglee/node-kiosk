const express = require('express');
const router = express.Router();

const ItemsController = require('../controllers/items.controller');
const itemsController = new ItemsController();

router.post('/items', itemsController.postItem);

router.get('/items', itemsController.getAllItems);

router.get('/items/:type', itemsController.getItemsByType);

router.delete('/items/:id', itemsController.deleteItem);

router.delete('/items/:id/confirmation', itemsController.deleteItemByConfirm);

router.put('/items/:id', itemsController.updateItem);

module.exports = router;
