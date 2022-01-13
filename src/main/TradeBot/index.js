const BotBase = require('./BotBase');
const { BotControl } = require('./modules');
const { flowRight } = require('./utils/utils');

class TradeBot extends flowRight(BotControl)(BotBase) {
  constructor(apiKey = '', apiSecret = '', options = {}) {
    super({
      apiKey,
      apiSecret,
      ...options,
    });
  }
}

module.exports = TradeBot;
