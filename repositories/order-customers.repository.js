const { OrderCustomer, ItemOrderCustomer, sequelize } = require('../models');

class OrderCustomersRepository {
  createOrderCustomer = async () => {
    const orderCustomer = await OrderCustomer.create({});
    return orderCustomer;
  };

  createItemOrderCustomer = async (item_id, order_customer_id, amount, option, price) => {
    await ItemOrderCustomer.create({ item_id, order_customer_id, amount, option, price });
  };

  findOrderCustomer = async (id) => {
    const order = await OrderCustomer.findOne({ where: { id } });
    return order;
  };

  updateOrderCustomerState = async (id, state, t) => {
    await OrderCustomer.update({ state }, { where: { id } }, { transaction: t });
  };

  deleteOrderCustomer = async (id, t) => {
    await OrderCustomer.destroy({ where: { id } }, { transaction: t });
  };
}
module.exports = OrderCustomersRepository;
