require('dotenv').config();
const ItemsRepository = require('../repositories/items.repository');
const HttpException = require('../utils/error');
const { myCache } = require('../routeCache.js');

const itemType = {
  COFFEE: 'coffee',
  JUICE: 'juice',
  FOOD: 'food',
};

class ItemsService {
  itemsRepository = new ItemsRepository();

  createItem = async (name, price, type, option_id) => {
    if (!name) throw new HttpException(412, '이름을 입력해주세요');

    if (!price) throw new HttpException(412, '가격을 입력해주세요');

    if (!Object.values(itemType).includes(type)) {
      throw new HttpException(412, '알맞은 타입을 지정해주세요');
    }

    const item = await this.itemsRepository.createItem(name, price, type, option_id);
    return item;
  };

  findAllItems = async () => {
    const items = await this.itemsRepository.findAllItems();
    // 메모리에서 옵션을 조회
    const options = myCache.get(process.env.CACHE_KEY);
    // 각 상품에 맞는 옵션을 붙여서 반환
    const optionsById = options.reduce((acc, option) => {
      acc[option.id] = option;
      return acc;
    }, {});
    const itemsWithOptions = items.map((item) => {
      const option = optionsById[item.option_id] || null;
      return { ...item.toJSON(), option };
    });

    return itemsWithOptions;
  };

  findItemsByType = async (type) => {
    if (!Object.values(itemType).includes(type)) {
      throw new HttpException(412, '알맞은 타입을 지정해주세요');
    }

    const items = await this.itemsRepository.findItemsByType(type);

    const options = myCache.get(process.env.CACHE_KEY);
    const optionsById = options.reduce((acc, option) => {
      acc[option.id] = option;
      return acc;
    }, {});
    const itemsWithOptions = items.map((item) => {
      const option = optionsById[item.option_id] || null;
      return { ...item.toJSON(), option };
    });
    return itemsWithOptions;
  };

  destroyItem = async (id) => {
    const item = await this.itemsRepository.findOneItem(id);
    if (!item) throw new HttpException(404, '상품을 찾을 수 없습니다');

    if (item.amount) {
      return { message: '현재 수량이 남아있습니다. 삭제하시겠습니까?' };
    }

    await this.itemsRepository.destroyItem(id);
    return { message: '상품이 삭제되었습니다.' };
  };

  destroyItemByConfirm = async (id, userConfirmed) => {
    if (!userConfirmed) {
      return { message: '상품 삭제가 취소되었습니다.' };
    }

    await this.itemsRepository.destroyItem(id);
    return { message: '상품이 삭제되었습니다.' };
  };

  updateItem = async (id, name, price) => {
    if (!name) throw new HttpException(412, '이름을 입력해주세요');

    if (price < 0) throw new HttpException(412, '알맞은 가격을 입력해주세요');

    await this.itemsRepository.updateItem(id, name, price);
  };
}
module.exports = ItemsService;
