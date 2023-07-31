const OptionsService = require('../services/options.service');

class OptionsController {
  optionsService = new OptionsService();

  postOption = async (req, res) => {
    const { extra_price, shot_price, hot } = req.body;

    try {
      const option = await this.optionsService.createOption(extra_price, shot_price, hot);
      res.json({ option });
    } catch (error) {
      const { status, message } = error;
      if (status) return res.status(status).json({ message });
      res.status(500).json({ message });
    }
  };
}
module.exports = OptionsController;
