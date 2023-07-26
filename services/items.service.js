const ItemsRepository = require('../repositories/items.repository');
const HttpException = require('../utils/error');

class ItemsService {
  itemsRepository = new ItemsRepository();

  createItem = async (name, price, type) => {
    const itemType = {
      COFFEE: 'coffee',
      JUICE: 'juice',
      FOOD: 'food',
    };

    if (!name) throw new HttpException(412, '이름을 입력해주세요');
    if (!price) throw new HttpException(412, '가격을 입력해주세요');
    if (!Object.values(itemType).includes(type)) {
      throw new HttpException(412, '알맞은 타입을 지정해주세요');
    }
    const item = await this.itemsRepository.createItem(name, price, type);
    return item;
  };
}
module.exports = ItemsService;
