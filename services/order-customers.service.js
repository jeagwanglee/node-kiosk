const OrderCustomersRepository = require('../repositories/order-customers.repository');
const ItemOrderCustomersRepository = require('../repositories/item-order-customers.repository');
const ItemsRepository = require('../repositories/items.repository');
const HttpException = require('../utils/error');
const { sequelize } = require('../models');
const { Transaction } = require('sequelize');

class OrderCustomersService {
  orderCustomersRepository = new OrderCustomersRepository();
  itemOrderCustomersRepository = new ItemOrderCustomersRepository();
  itemsRepository = new ItemsRepository();

  createOrderCustomer = async (itemOrderDetails) => {
    // 주문 생성 후 반환값에서 id 조회
    // body로 받은 item_id, amount로 하위 주문 생성  itemOrderDetails = [{item_id:1, amount: 10}, {item_id: 2, amount:20}, ...]
    const orderCustomer = await this.orderCustomersRepository.createOrderCustomer();
    const order_customer_id = orderCustomer.id;
    let totalPrice = 0;

    await Promise.all(
      itemOrderDetails.map(async (order) => {
        const { item_id, amount, option, productPrice } = order;
        const price = productPrice + option.extra_price + option.shot_price;
        await this.itemOrderCustomersRepository.createItemOrderCustomer(
          item_id,
          order_customer_id,
          amount,
          option,
          price
        );
        totalPrice += price * amount;
      })
    );
    return totalPrice;
    //주문한 모든 상품 가격의 합을 고객에게 반환해주세요.
    // 가격 : item.price , * amount
  };

  // 주문 완료 시 state를 true로 수정, 트랜잭션으로 item의 amount 감소 동시처리
  completeOrderCustomer = async (id) => {
    const t = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      const state = true;
      const itemOrderCustomers = await this.itemOrderCustomersRepository.findItemOrderCustomers(id);

      // item_id 각각에대해 amount감소
      for (const itemOrderCustomer of itemOrderCustomers) {
        const { item_id, amount } = itemOrderCustomer;
        await this.orderCustomersRepository.updateOrderCustomerState(id, state, { transaction: t });
        await this.itemsRepository.updateItemAmount(item_id, -amount, { transaction: t });
      }

      return await t.commit();
    } catch (error) {
      await t.rollback();
      throw new HttpException(500, error.message);
    }
  };
  // 주문 취소 시 완료된 주문이라면 에러
  // 주문 취소 시 state가 0이면 order_customer 데이터, item_order_customer 데이터 트랜잭션 을 적용해 일괄 삭제
  cancelOrderCustomer = async (id) => {
    const t = await sequelize.transaction({
      // 격리 수준 설정
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      const order = await this.orderCustomersRepository.findOrderCustomer(id);

      if (order.state) {
        throw new HttpException(400, '완료된 주문은 취소할 수 없습니다.');
      }
      await this.orderCustomersRepository.deleteOrderCustomer(id, { transaction: t });
      // order_customer_id 가 있는 ItemOrderCustomer 레코드들을 전부 삭제
      await this.itemOrderCustomersRepository.deleteItemOrderCustomers(id, { transaction: t });
    } catch (error) {
      await t.rollback();
      throw new HttpException(500, error.message);
    }
  };
}
module.exports = OrderCustomersService;
