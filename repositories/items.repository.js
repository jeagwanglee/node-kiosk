const { Item } = require('../models');

class ItemsRepository {
  createItem = async (name, price, type) => {
    const item = await Item.create({ name, price, type });
    return item;
  };

  findAllItems = async () => {
    const items = await Item.findAll({});
    return items;
  };

  findItemsByType = async (type) => {
    const items = await Item.findAll({ where: { type } });
    return items;
  };

  findOneItem = async (id) => {
    const amount = await Item.findOne({ where: { id } });
    return amount;
  };

  destroyItem = async (id) => {
    await Item.destroy({ where: { id } });
  };
}
module.exports = ItemsRepository;
