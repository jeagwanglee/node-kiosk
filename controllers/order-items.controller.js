const OrderItemsService = require('../services/order-items.service');

class OrderItemsController {
  orderItemsService = new OrderItemsService();

  postOrderItem = async (req, res, next) => {
    const { item_id } = req.params;
    const { amount } = req.body;

    try {
      const order = await this.orderItemsService.createOrderItem(item_id, amount);
      res.json({ order });
    } catch (err) {
      next(err);
    }
  };

  putOrderItem = async (req, res, next) => {
    const { item_id, id } = req.params;
    const { state } = req.body;

    try {
      await this.orderItemsService.updateOrderItemState(item_id, state, id);
      res.json({ message: '발주 상태가 수정되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
module.exports = OrderItemsController;
