const express = require('express');
const router = express.Router();

const OrderCustomersController = require('../controllers/order-customers.controller');
const orderCustomersController = new OrderCustomersController();

router.post('/order_customers', orderCustomersController.postOrderCustomer);

//상품 주문 완료
router.patch('/order_customers/:id/complete', orderCustomersController.completeOrderCustomer);
//상품 주문 취소
router.patch('/order_customers/:id/cancel', orderCustomersController.cancelOrderCustomer);

module.exports = router;
