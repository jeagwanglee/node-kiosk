require('dotenv').config();
const OrderCustomersRepository = require('../repositories/order-customers.repository');
const ItemOrderCustomersRepository = require('../repositories/item-order-customers.repository');
const ItemsRepository = require('../repositories/items.repository');
const HttpException = require('../utils/error');
const { sequelize } = require('../models');
const { Transaction } = require('sequelize');
const { myCache } = require('../routeCache.js');

class OrderCustomersService {
  orderCustomersRepository = new OrderCustomersRepository();
  itemOrderCustomersRepository = new ItemOrderCustomersRepository();
  itemsRepository = new ItemsRepository();

  createOrderCustomer = async (itemOrderDetails) => {
    // 주문 생성 후 반환값에서 id 조회
    // body로 받은 item_id, amount로 하위 주문 생성  itemOrderDetails = [{item_id:1, amount: 10}, {item_id: 2, amount:20}, ...]
    const orderCustomer = await this.orderCustomersRepository.createOrderCustomer();
    const order_customer_id = orderCustomer.id;
    // 주문 전체 가격
    let totalPrice = 0;

    const options = myCache.get(process.env.CACHE_KEY);
    const optionsById = options.reduce((acc, option) => {
      acc[option.id] = option;
      return acc;
    }, {});

    await Promise.all(
      itemOrderDetails.map(async (order) => {
        const { item_id, amount, itemOption, productPrice } = order;
        const { option_id, isExtraPrice, shotAmount } = itemOption;
        // 옵션 (가격) 조회
        const option = optionsById[option_id];
        // 상품당 옵션 포함 가격 : price
        const price = productPrice + option.extra_price * isExtraPrice + option.shot_price * shotAmount;
        await this.itemOrderCustomersRepository.createItemOrderCustomer(
          item_id,
          order_customer_id,
          amount,
          itemOption,
          price
        );
        totalPrice += price * amount;
      })
    );
    return { order_customer_id, totalPrice };
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
        await this.orderCustomersRepository.updateOrderCustomerState(id, state, t);
        await this.itemsRepository.updateItemAmount(item_id, -amount, t);
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
      await this.orderCustomersRepository.deleteOrderCustomer(id, t);
      // order_customer_id 가 있는 ItemOrderCustomer 레코드들을 전부 삭제
      await this.itemOrderCustomersRepository.deleteItemOrderCustomers(id, t);
    } catch (error) {
      await t.rollback();
      throw new HttpException(500, error.message);
    }
  };
}
module.exports = OrderCustomersService;
