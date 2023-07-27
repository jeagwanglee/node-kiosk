const OrderItemsService = require('../services/order-items.service');

class OrderItemsController {
  orderItemsService = new OrderItemsService();

  postOrderItem = async (req, res) => {
    const { item_id } = req.params;
    const { amount } = req.body;

    try {
      const order = await this.orderItemsService.createOrderItem(item_id, amount);
      res.json({ order });
    } catch (error) {
      const { status, message } = error;
      if (status) return res.status(status).json({ message });
      res.status(500).json({ message });
    }
  };

  putOrderItem = async (req, res) => {
    const { item_id, id } = req.params;
    const { state } = req.body;

    try {
      await this.orderItemsService.updateOrderItemState(item_id, state, id);
      res.json({ message: '발주 상태가 수정되었습니다.' });
    } catch (error) {
      const { status, message } = error;
      if (status) return res.status(status).json({ message });
      res.status(500).json({ message });
    }
  };
}
module.exports = OrderItemsController;
