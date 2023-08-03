const { OrderItem } = require('../models');

class OrderItemsRepository {
  createOrderItem = async (item_id, amount) => {
    const order = await OrderItem.create({ item_id, amount });
    return order;
  };

  updateOrderItemState = async (id, nextState, t) => {
    await OrderItem.update({ state: nextState }, { where: { id } }, { transaction: t });
  };

  findOrderItemById = async (id) => {
    const orderItem = await OrderItem.findByPk(id);
    return orderItem;
  };
}
module.exports = OrderItemsRepository;
