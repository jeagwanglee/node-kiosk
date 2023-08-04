const ItemsService = require('../services/items.service');

class ItemsController {
  itemsService = new ItemsService();

  postItem = async (req, res, next) => {
    const { name, price, type, option_id } = req.body;

    try {
      const item = await this.itemsService.createItem(name, price, type, option_id);
      res.json({ item });
    } catch (err) {
      next(err);
    }
  };

  getAllItems = async (req, res, next) => {
    try {
      const items = await this.itemsService.findAllItems();
      res.json({ items });
    } catch (err) {
      next(err);
    }
  };

  getItemsByType = async (req, res, next) => {
    const { type } = req.params;

    try {
      const items = await this.itemsService.findItemsByType(type);
      res.json({ items });
    } catch (err) {
      next(err);
    }
  };

  deleteItem = async (req, res, next) => {
    const { id } = req.params;

    try {
      const result = await this.itemsService.destroyItem(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  deleteItemByConfirm = async (req, res, next) => {
    const { id } = req.params;
    const { userConfirmed } = req.body;

    try {
      const result = await this.itemsService.destroyItemByConfirm(id, userConfirmed);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  updateItem = async (req, res, next) => {
    const { id } = req.params;
    const { name, price } = req.body;

    try {
      await this.itemsService.updateItem(id, name, price);
      res.json({ message: '상품이 수정되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
module.exports = ItemsController;
