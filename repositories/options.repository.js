const { Option } = require('../models');

class OptionsRepository {
  createOption = async (extra_price, shot_price, hot) => {
    await Option.create({ extra_price, shot_price, hot });
  };

  findAllOptions = async () => {
    const options = await Option.findAll({});
    return options;
  };
}
module.exports = OptionsRepository;
