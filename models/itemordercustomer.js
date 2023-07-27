'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemOrderCustomer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Item, {
        targetKey: 'id',
        foreignKey: 'item_id',
      });
      this.belongsTo(models.OrderCustomer, {
        targetKey: 'id',
        foreignKey: 'order_customer_id',
      });
    }
  }
  ItemOrderCustomer.init(
    {
      item_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      order_customer_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'ItemOrderCustomer',
    }
  );
  return ItemOrderCustomer;
};
