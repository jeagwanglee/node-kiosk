const ItemsService = require('../services/items.service');

class ItemsController {
  itemsService = new ItemsService();

  postItem = async (req, res) => {
    const { name, price, type } = req.body;

    try {
      const item = await this.itemsService.createItem(name, price, type);
      res.json({ item });
    } catch (error) {
      const { status, message } = error;
      if (status) return res.status(status).json({ message });
      res.status(500).json({ message });
    }
  };

  getAllItems = async (req, res) => {
    try {
      const items = await this.itemsService.findAllItems();
      res.json({ items });
    } catch (error) {
      const { status, message } = error;
      if (status) return res.status(status).json({ message });
      res.status(500).json({ message });
    }
  };

  getItemsByType = async (req, res) => {
    const { type } = req.params;

    try {
      const items = await this.itemsService.findItemsByType(type);
      res.json({ items });
    } catch (error) {
      const { status, message } = error;
      if (status) return res.status(status).json({ message });
      res.status(500).json({ message });
    }
  };

  deleteItem = async (req, res) => {
    const { id } = req.params;

    try {
      const result = await this.itemsService.destroyItem(id);
      res.json(result);
    } catch (error) {
      const { status, message } = error;
      if (status) return res.status(status).json({ message });
      res.status(500).json({ message });
    }
  };

  deleteItemByConfirm = async (req, res) => {
    const { id } = req.params;
    const { userConfirmed } = req.body;

    try {
      const result = await this.itemsService.destroyItemByConfirm(id, userConfirmed);
      res.json(result);
    } catch (error) {
      const { status, message } = error;
      if (status) return res.status(status).json({ message });
      res.status(500).json({ message });
    }
  };
}
module.exports = ItemsController;
