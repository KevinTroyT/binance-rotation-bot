/* eslint-disable promise/always-return */
/* eslint-disable no-console */
const { Spot } = require('@binance/connector');
// const TradeBot = require('./TradeBot/index.js');
const apiKey =
  'CpVLwLXdLGaL6JPPAAMrA95DkS6C6QZrV67lFY0kYDvR25c3Jatqil6tgMmn5Ax2';
const apiSecret =
  'aRy7ibn0vuJZdX1QK5CDj01FCA04KbBpRBulxxRROh1NapOFCeh459R3VJ5bJuyH';
// const apiKey =
//   'MHkNrmxnnpXMz0MGZR3dQ6xutO2IQwKVCOdNvhd2S2yl6iHEZwv6QmQEqLxJaDfg';
// const apiSecret =
//   '6mlauF5YozMP5lsCEFSSaa7p7PRxE6z5fhOsNyDpQzzeerYDaPqEJd5S0tDeZilO';

const client = new Spot(apiKey, apiSecret, {
  baseURL: 'http://123.58.210.197:4006/',
});

// client.account().then((res) => {
//   console.log(res.data);
// });
// eslint-disable-next-line promise/catch-or-return
client
  .tickerPrice('ETHUSDT')
  // .account()
  // .newOrder('BNBETH', 'SELL', 'MARKET', { quantity: '10' })
  .then((res) => {
    console.log(res.data);
  })
  .catch((e) => {
    console.log(e);
  });
// const tb = new TradeBot(apiKey, apiSecret, {
//   baseURL: 'http://172.87.30.51:8012/',
// });
// tb.onTick((ms) => {
//   const s = (ms / 1000).toFixed(0);
//   const ss = s % 60;
//   const mm = Math.floor(s / 60);
//   console.log(`${mm.toString().padStart(2, 0)}:${ss.toString().padStart(2, 0)}`)
// });
// tb.onUpdated((arg) => {
//   let obj = {};
//   arg.forEach(e => {
//     obj[e.symbol] = e
//   })
// });
// tb.startBot();
