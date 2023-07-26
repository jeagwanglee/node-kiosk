'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

class Database {
  constructor() {
    this.db = {};
    this.setupDatabase();
  }

  setupDatabase() {
    let sequelize;
    if (config.use_env_variable) {
      sequelize = new Sequelize(process.env[config.use_env_variable], config);
    } else {
      sequelize = new Sequelize(config.database, config.username, config.password, config);
    }

    fs.readdirSync(__dirname)
      .filter((file) => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1;
      })
      .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        // db에 모델이름:모델 모듈
        this.db[model.name] = model;
      });

    //  연관관계
    Object.keys(this.db).forEach((modelName) => {
      if (this.db[modelName].associate) {
        this.db[modelName].associate(this.db);
      }
    });

    this.db.sequelize = sequelize;
    this.db.Sequelize = Sequelize;
  }
}
const database = new Database();
module.exports = database.db;
