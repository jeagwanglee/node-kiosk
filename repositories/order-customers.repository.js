const { OrderCustomer, ItemOrderCustomer, sequelize } = require('../models');

class OrderCustomersRepository {
  createOrderCustomer = async () => {
    const orderCustomer = await OrderCustomer.create({});
    return orderCustomer;
  };

  createItemOrderCustomer = async (item_id, order_customer_id, amount, option, price) => {
    await ItemOrderCustomer.create({ item_id, order_customer_id, amount, option, price });
  };
}
module.exports = OrderCustomersRepository;
