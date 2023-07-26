const { Item } = require('../models');

class ItemsRepository {
  createItem = async (name, price, type) => {
    const item = await Item.create({ name, price, type });
    return item;
  };
}
module.exports = ItemsRepository;
