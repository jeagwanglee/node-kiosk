const express = require('express');
const router = express.Router();

const OrderCustomersController = require('../controllers/order-customers.controller');
const orderCustomersController = new OrderCustomersController();

router.post('/order-customers', orderCustomersController.postOrderCustomer);

module.exports = router;
