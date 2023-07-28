const OrderCustomersRepository = require('../repositories/order-customers.repository');
const ItemsRepository = require('../repositories/items.repository');

class OrderCustomersService {
  orderCustomersRepository = new OrderCustomersRepository();
  itemsRepository = new ItemsRepository();

  createOrderCustomer = async (itemOrderDetails) => {
    // 주문 생성 후 반환값에서 id 조회
    // body로 받은 item_id, amount로 하위 주문 생성  itemOrderDetails = [{item_id:1, amount: 10}, {item_id: 2, amount:20}, ...]
    const orderCustomer = await this.orderCustomersRepository.createOrderCustomer();
    const order_customer_id = orderCustomer.id;
    let totalPrice = 0;

    await Promise.all(
      itemOrderDetails.map(async (order) => {
        const { item_id, amount, option, price } = order;
        await this.orderCustomersRepository.createItemOrderCustomer(item_id, order_customer_id, amount, option, price);
        totalPrice += (price + option.extra_price + option.shot_price) * amount;
      })
    );
    return totalPrice;
    //주문한 모든 상품 가격의 합을 고객에게 반환해주세요.
    // 가격 : item.price , * amount
  };
}
module.exports = OrderCustomersService;
