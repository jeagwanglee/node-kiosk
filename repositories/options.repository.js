require('dotenv').config();
const { Option } = require('../models');

class OptionsRepository {
  createOption = async (extra_price, shot_price, hot) => {
    const option = await Option.create({ extra_price, shot_price, hot });
    return option;
  };

  findAllOptions = async () => {
    const options = await Option.findAll({});
    return options;
  };
}
module.exports = OptionsRepository;
