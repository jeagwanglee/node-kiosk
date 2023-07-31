const { Option } = require('../models');

class OptionsRepository {
  createOption = async (extra_price, shot_price, hot) => {
    await Option.create({ extra_price, shot_price, hot });
  };
}
module.exports = OptionsRepository;
