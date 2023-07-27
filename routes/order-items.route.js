const express = require('express');
const router = express.Router();

const OrderItemsController = require('../controllers/order-items.controller');
const orderItemsController = new OrderItemsController();

router.post('/items/:item_id/order-items', orderItemsController.postOrderItem);

router.put('/items/:item_id/order-items/:id', orderItemsController.putOrderItem);

module.exports = router;
