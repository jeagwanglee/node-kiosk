const OptionsRepository = require('../repositories/options.repository');
const { updateOptions } = require('../routeCache.js');

class OptionsService {
  optionsRepository = new OptionsRepository();

  createOption = async (extra_price, shot_price, hot) => {
    const option = await this.optionsRepository.createOption(extra_price, shot_price, hot);
    updateOptions();
    return option;
  };
}
module.exports = OptionsService;
