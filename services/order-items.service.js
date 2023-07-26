const OrderItemsRepository = require('../repositories/order-items.repository');
const ItemsRepository = require('../repositories/items.repository');
const HttpException = require('../utils/error');
const orderItemState = {
  ORDERED: 0,
  PENDING: 1,
  COMPLETED: 2,
  CANCELED: 3,
};

class OrderItemsService {
  orderItemsRepository = new OrderItemsRepository();
  itemsRepository = new ItemsRepository();

  createOrderItem = async (item_id, amount) => {
    const item = await this.itemsRepository.findOneItem(item_id);
    if (!item) throw new HttpException(404, '상품을 찾을 수 없습니다');

    const order = await this.orderItemsRepository.createOrderItem(item_id, amount);
    return order;
  };
}
module.exports = OrderItemsService;
