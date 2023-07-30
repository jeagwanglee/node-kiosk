const OrderCustomersService = require('../services/order-customers.service');

class OrderCustomersController {
  orderCustomersService = new OrderCustomersService();

  postOrderCustomer = async (req, res) => {
    // 주문 ID를 만든다.
    // 하위 테이블에 item_id, id, amount를 인자로 목록을 만든다.
    // 한번에 여러 item_id를 인자로 받아서 테이블을 생성

    const { itemOrderDetails } = req.body;

    try {
      const totalPrice = await this.orderCustomersService.createOrderCustomer(itemOrderDetails);
      res.json({ totalPrice });
    } catch (error) {
      console.log(error);
      const { status, message } = error;
      if (status) return res.status(status).json({ message });
      res.status(500).json({ message });
    }
  };

  completeOrderCustomer = async (req, res) => {
    const { id } = req.params;
    //이 id는 order_customer의 Id

    try {
      await this.orderCustomersService.completeOrderCustomer(id);
      res.json({ message: '주문이 수정되었습니다.' });
    } catch (error) {
      const { status, message } = error;
      if (status) return res.status(status).json({ message });
      res.status(500).json({ message });
    }
  };

  cancelOrderCustomer = async (req, res) => {
    const { id } = req.params;

    try {
      await this.orderCustomersService.cancelOrderCustomer(id);
      res.json({ message: '주문이 취소되었습니다.' });
    } catch (error) {
      const { status, message } = error;
      if (status) return res.status(status).json({ message });
      res.status(500).json({ message });
    }
  };
}
module.exports = OrderCustomersController;
