const ItemsRepository = require('../repositories/items.repository');
const HttpException = require('../utils/error');
const itemType = {
  COFFEE: 'coffee',
  JUICE: 'juice',
  FOOD: 'food',
};

class ItemsService {
  itemsRepository = new ItemsRepository();

  createItem = async (name, price, type) => {
    if (!name) throw new HttpException(412, '이름을 입력해주세요');
    if (!price) throw new HttpException(412, '가격을 입력해주세요');
    if (!Object.values(itemType).includes(type)) {
      throw new HttpException(412, '알맞은 타입을 지정해주세요');
    }
    const item = await this.itemsRepository.createItem(name, price, type);
    return item;
  };

  findAllItems = async () => {
    const items = await this.itemsRepository.findAllItems();
    return items;
  };

  findItemsByType = async (type) => {
    if (!Object.values(itemType).includes(type)) {
      throw new HttpException(412, '알맞은 타입을 지정해주세요');
    }

    const items = await this.itemsRepository.findItemsByType(type);
    return items;
  };
}
module.exports = ItemsService;
