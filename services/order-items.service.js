const OrderItemsRepository = require('../repositories/order-items.repository');
const ItemsRepository = require('../repositories/items.repository');
const HttpException = require('../utils/error');
const { sequelize } = require('../models');
const orderItemState = {
  ORDERED: 0,
  PENDING: 1,
  COMPLETED: 2,
  CANCELED: 3,
};
const { Transaction } = require('sequelize');

class OrderItemsService {
  orderItemsRepository = new OrderItemsRepository();
  itemsRepository = new ItemsRepository();

  createOrderItem = async (item_id, amount) => {
    const item = await this.itemsRepository.findOneItem(item_id);
    if (!item) throw new HttpException(404, '상품을 찾을 수 없습니다');

    const order = await this.orderItemsRepository.createOrderItem(item_id, amount);
    return order;
  };

  // 발주 amount를 알기위해 발주 내역을 조회. params로 items_id와 id를 받는다.
  // id(order_item)로 발주 정보 조회

  // 발주 상태 수정 - 서비스
  // 1. 현재 발주 상태를 조회
  // 2. 현재 ordered 이면 state가 pending canceled 일때만 가능
  // 3. 현재 pending 이면 state가 pending canceled 일때만 가능
  updateOrderItemState = async (item_id, nextState, id) => {
    const t = await sequelize.transaction({
      // 격리 수준 설정
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    // 상품 정보 조회
    const item = await this.itemsRepository.findOneItem(item_id);
    if (!item) throw new HttpException(404, '상품을 찾을 수 없습니다');

    //발주 정보 조회
    const orderItem = await this.orderItemsRepository.findOrderItemById(id);
    const currentState = orderItem.state;

    //  case: ordered -> pending / canceled
    if (
      currentState === orderItemState.ORDERED &&
      (nextState === orderItemState.PENDING || nextState === orderItemState.CANCELED)
    ) {
      return await this.orderItemsRepository.updateOrderItemState(id, nextState);
    }
    // case: pending -> canceled
    if (currentState === orderItemState.PENDING && nextState === orderItemState.CANCELED) {
      return await this.orderItemsRepository.updateOrderItemState(id, nextState);
    }

    // case: pending -> completed (트랜잭션 적용)
    if (currentState === orderItemState.PENDING && nextState === orderItemState.COMPLETED) {
      try {
        // 상태 업데이트
        await this.orderItemsRepository.updateOrderItemState(id, nextState, t);

        // 현재 수량 추가
        const amount = item.amount + orderItem.amount;
        await this.itemsRepository.updateItemAmount(item_id, amount, t);
        return await t.commit();
      } catch (error) {
        await t.rollback();
        throw new HttpException(500, error.message);
      }
    }

    // case: completed -> canceled/pending/ordered
    if (
      currentState === orderItemState.COMPLETED &&
      (nextState === orderItemState.CANCELED ||
        nextState === orderItemState.PENDING ||
        nextState === orderItemState.ORDERED)
    ) {
      // (item의 현재 수량이 발주 수량보다 적으면 취소 불가능. `현재 수량이 발주 수량보다 적어 발주 취소가 불가능합니다.` 에러메세지 반환)
      if (item.amount < orderItem.amount) {
        throw new HttpException(400, '현재 수량이 발주 수량보다 적어 발주 취소가 불가능합니다.');
      }
      try {
        // 현재수량 >= 발주 수량  : 트랜잭션 적용
        // 상태 수정, 현재 수량 감소
        await this.orderItemsRepository.updateOrderItemState(id, nextState, t);
        const amount = item.amount - orderItem.amount;
        await this.itemsRepository.updateItemAmount(item_id, amount, t);
        return await t.commit();
      } catch (error) {
        await t.rollback();
        throw new HttpException(500, error.message);
      }
    }
  };
}
module.exports = OrderItemsService;
