const OrderCustomersService = require('../services/order-customers.service');

class OrderCustomersController {
  customersService = new OrderCustomersService();

  postOrderCustomer = async (req, res) => {
    res.json('hi');
  };
}
module.exports = OrderCustomersController;
