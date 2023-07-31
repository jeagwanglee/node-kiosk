const OptionsService = require('../services/options.service');

class OptionsController {
  optionsService = new OptionsService();

  postOption = async (req, res) => {
    const { extra_price, shot_price, hot } = req.body;

    try {
      await this.optionsService.createOption(extra_price, shot_price, hot);
      res.json({ message: '옵션이 추가되었습니다.' });
    } catch (error) {
      const { status, message } = error;
      if (status) return res.status(status).json({ message });
      res.status(500).json({ message });
    }
  };
}
module.exports = OptionsController;
