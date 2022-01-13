/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-shadow */
const axios = require('axios');

// eslint-disable-next-line prettier/prettier
const flowRight = (...functions) => input => functions.reduceRight(
  (input, fn) => fn(input),
  input
)
const notification = (url, config, __this) => {
  axios.post(url, config).catch((e) => {
    __this.onError(e);
  });
};
const tradeTemplate = (tradeQuery, __this) => {
  let content = '';
  tradeQuery.forEach((e) => {
    content += `
  > 期待交易:<font color="comment">${e.symbol}</font>
  > 方向:<font color="warning">${e.side === 'BUY' ? '购买' : '卖出'}</font>
  > 数量:<font color="comment”>${e.usdt.toFixed(2)}USDT</font>\n——————\n`;
  });
  const template = {
    msgtype: 'markdown',
    markdown: {
      content: `<font color="warning">即将发生交易</font>，请相关同事注意.
    ${content}\n目前账户总价值（USDT）
    > USDT: ${__this.USDT}
    > BTC: ${__this.BTC.getPriceInUSDT().toFixed(2)}USDT -- ${__this.BTC.getPrice()}
    > ETH: ${__this.ETH.getPriceInUSDT().toFixed(2)}USDT -- ${__this.ETH.getPrice()}`,
    },
  };
  return template;
};

module.exports = {
  flowRight,
  notification,
  tradeTemplate,
};
