const OptionsRepository = require('../repositories/options.repository');

class OptionsService {
  optionsRepository = new OptionsRepository();

  createOption = async (extra_price, shot_price, hot) => {
    await this.optionsRepository.createOption(extra_price, shot_price, hot);
  };
}
module.exports = OptionsService;
