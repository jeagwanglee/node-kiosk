const OrderCustomersService = require('../services/order-customers.service');

class OrderCustomersController {
  orderCustomersService = new OrderCustomersService();

  postOrderCustomer = async (req, res) => {
    // 주문 ID를 만든다.
    // 하위 테이블에 item_id, id, amount를 인자로 목록을 만든다.
    // 한번에 여러 item_id를 인자로 받아서 테이블을 생성

    const { itemOrderDetails } = req.body;

    try {
      await this.orderCustomersService.createOrderCustomer(itemOrderDetails);
      res.json({ message: '주문을 완료했습니다.' });
    } catch (error) {
      console.log(error);
      const { status, message } = error;
      if (status) return res.status(status).json({ message });
      res.status(500).json({ message });
    }
  };
}
module.exports = OrderCustomersController;
