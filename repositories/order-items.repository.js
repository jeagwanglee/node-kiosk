const { OrderItem } = require('../models');

class OrderItemsRepository {
  createOrderItem = async (item_id, amount) => {
    const order = await OrderItem.create({ item_id, amount });
    return order;
  };
}
module.exports = OrderItemsRepository;
