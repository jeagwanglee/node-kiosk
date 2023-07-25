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
    if (config.use_env_variable) {
      this.sequelize = new Sequelize(process.env[config.use_env_variable], config);
    } else {
      this.sequelize = new Sequelize(config.database, config.username, config.password, config);
    }

    this.db = db;

    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });

    db.sequelize = this.sequelize;
    db.Sequelize = Sequelize;
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      console.log('Connection established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
}

module.exports = Database;
