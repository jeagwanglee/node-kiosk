const OrderCustomersRepository = require('../repositories/order-customers.repository');

class OrderCustomersService {
  customersRepository = new OrderCustomersRepository();

  func = async (req, res) => {};
}
module.exports = OrderCustomersService;
