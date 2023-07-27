const { OrderItem } = require('../models');

class OrderItemsRepository {
  createOrderItem = async (item_id, amount) => {
    const order = await OrderItem.create({ item_id, amount });
    return order;
  };

  updateOrderItemState = async (id, nextState) => {
    await OrderItem.update({ state: nextState }, { where: { id } });
  };

  findOrderItemById = async (id) => {
    const orderItem = await OrderItem.findByPk(id);
    return orderItem;
  };
}
module.exports = OrderItemsRepository;
