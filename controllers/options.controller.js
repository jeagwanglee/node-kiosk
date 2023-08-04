const OptionsService = require('../services/options.service');

class OptionsController {
  optionsService = new OptionsService();

  postOption = async (req, res, next) => {
    const { extra_price, shot_price, hot } = req.body;

    try {
      const option = await this.optionsService.createOption(extra_price, shot_price, hot);
      res.json({ option });
    } catch (err) {
      next(err);
    }
  };
}
module.exports = OptionsController;
