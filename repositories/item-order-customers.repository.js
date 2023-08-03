const { ItemOrderCustomer } = require('../models');

class ItemOrderCustomersRepository {
  createItemOrderCustomer = async (item_id, order_customer_id, amount, option, price) => {
    await ItemOrderCustomer.create({ item_id, order_customer_id, amount, option, price });
  };

  findItemOrderCustomers = async (order_customer_id) => {
    await ItemOrderCustomer.findAll({ where: { order_customer_id } });
  };

  deleteItemOrderCustomers = async (order_customer_id, t) => {
    await ItemOrderCustomer.destroy({ where: { order_customer_id } }, { transaction: t });
  };
}
module.exports = ItemOrderCustomersRepository;
