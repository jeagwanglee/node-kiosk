const express = require('express');
const router = express.Router();

const OrderItemsController = require('../controllers/order-items.controller');
const orderItemsController = new OrderItemsController();

router.post('/order-items/:item_id', orderItemsController.postOrderItem);

module.exports = router;
