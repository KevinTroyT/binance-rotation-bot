/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
const { Spot } = require('@binance/connector');
const { Decimal } = require('decimal.js');
const Timer = require('./modules/timer');
const Coin = require('./modules/coin');
const { tradeTemplate, notification } = require('./utils/utils');

class BotBase {
  constructor(options) {
    const { apiKey, apiSecret, baseURL, tradeOver, url } = options;
    setInterval(() => {}, 999999);
    // todo: 多币轮动 coin: [symbol: xx,percent: xx]
    this.tradeOver = tradeOver || 0.02;
    this.tradeQuery = [];
    this.url =
      url ||
      'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=企业微信通知';
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseURL = baseURL;
    this.client = new Spot(apiKey, apiSecret, { baseURL });
    this.client
      .account()
      .then((res) => {
        this.BTC = new Coin({
          symbol: 'BTCUSDT',
          amount: new Decimal(res.data.balances[0].free),
          percent: 0.5,
          client: this.client,
        });
        this.BNB = new Coin({
          symbol: 'BNBUSDT',
          amount: new Decimal(res.data.balances[4].free),
          percent: 0.5,
          client: this.client,
        });
        this.ETH = new Coin({
          symbol: 'ETHUSDT',
          amount: new Decimal(res.data.balances[2].free),
          percent: 0.5,
          client: this.client,
        });
        this.USDT = new Decimal(res.data.balances[11].free);
        this.coin = [this.BTC, this.ETH];
        return this.coin;
      })
      .catch((e) => {
        this.onError(e);
      });
    this.botStatus = 0;
    this.timer = new Timer({ _this: this });
    this.total = new Decimal(0);
  }

  setBotStatus(status) {
    this.botStatus = status;
  }

  getBotStatus() {
    return this.botStatus;
  }

  updateAmount() {
    return new Promise((resolve, reject) => {
      this.client
        .account()
        .then((res) => {
          this.BTC.update(new Decimal(res.data.balances[0].free));
          this.BNB.update(new Decimal(res.data.balances[4].free));
          this.ETH.update(new Decimal(res.data.balances[2].free));
          this.USDT = new Decimal(res.data.balances[11].free);
          this.checkPercentWithUSDT();
          resolve(this.coin);
          return this.coin;
        })
        .catch((e) => {
          this.onError(e);
          reject(e);
        });
    });
  }

  checkPercent() {
    const usdtPriceList = [];
    const percentPriceList = [];
    this.total = new Decimal(0);
    this.coin.forEach((e) => {
      this.total = this.total.plus(e.getPriceInUSDT());
      usdtPriceList.push({
        symbol: e.symbol,
        getPriceInUSDT: e.getPriceInUSDT(),
      });
    });
    usdtPriceList.forEach((e) => {
      percentPriceList.push({
        symbol: e.symbol,
        percent: e.getPriceInUSDT.div(this.total),
      });
    });
    return percentPriceList;
  }

  checkPercentWithUSDT() {
    const usdtPriceList = [];
    const percentPriceList = [];
    this.total = new Decimal(0).plus(this.USDT);
    this.coin.forEach((e) => {
      this.total = this.total.plus(e.getPriceInUSDT());
      usdtPriceList.push({
        symbol: e.symbol,
        usdt: e.getPriceInUSDT(),
        amount: e.amount,
        price: e.price,
      });
    });
    usdtPriceList.forEach((e) => {
      percentPriceList.push({
        symbol: e.symbol,
        percent: e.usdt.div(this.total),
        usdt: e.usdt,
        amount: e.amount,
        price: e.price,
      });
    });
    percentPriceList.push({
      symbol: 'USDT',
      percent: this.USDT.div(this.total),
      amount: this.USDT,
    });
    percentPriceList.push({
      symbol: 'TOTAL',
      amount: this.total,
    });
    this.onUpdatedHandle(percentPriceList);

    return percentPriceList;
  }

  checkPrice() {
    this.tradeQuery = [];
    const percentList = this.checkPercent();
    const percentObj = {};
    percentList.forEach((e) => {
      percentObj[e.symbol] = e;
    });
    // 改多币逻辑： 把所有币大于自身比例的换成usdt然后再按照少到多买足够的小于比例的币。

    const diff = percentObj.BTCUSDT.percent.minus(percentObj.ETHUSDT.percent);
    if (Decimal.abs(diff) >= this.tradeOver) {
      // Need Trade between BTC and ETH
      let side;
      const type = 'MARKET';
      const symbol = 'ETHBTC';
      if (diff < 0) {
        // Less BTC
        side = 'SELL';
        const usdt = this.total.times(Decimal.abs(diff)).div(2);
        const quantity = usdt.div(this.ETH.getPrice());
        this.tradeQuery.push({
          symbol,
          type,
          side,
          quantity: quantity.toFixed(4),
          usdt,
        });
      } else {
        // Less ETH
        side = 'BUY';
        const usdt = this.total.times(Decimal.abs(diff)).div(2);
        const quantity = usdt.div(this.ETH.getPrice());
        this.tradeQuery.push({
          symbol,
          type,
          side,
          quantity: quantity.toFixed(4),
          usdt,
        });
      }
    }
    if (this.USDT > 40) {
      const quantity = this.USDT.minus(5).div(2);
      this.tradeQuery.push({
        symbol: 'ETHUSDT',
        type: 'MARKET',
        side: 'BUY',
        quantity: quantity.div(this.ETH.getPrice()).toFixed(4),
        usdt: this.USDT.minus(5).div(2),
      });
      this.tradeQuery.push({
        symbol: 'BTCUSDT',
        type: 'MARKET',
        side: 'BUY',
        quantity: quantity.div(this.BTC.getPrice()).toFixed(4),
        usdt: this.USDT.minus(5).div(2),
      });
    }
    if (this.tradeQuery.length !== 0) {
      notification(this.url, tradeTemplate(this.tradeQuery, this), this);
    }
  }

  onTrade(fn) {
    this.onTradeHandle = (symbol) => {
      fn(symbol);
    };
  }

  onTick(fn) {
    this.onTickHandle = (ms) => {
      fn(ms);
    };
  }

  onNotifacation(fn) {
    this.onNotifacationHandle = () => {
      fn();
    };
  }

  onUpdated(fn) {
    this.onUpdatedHandle = (arg) => {
      fn(arg);
    };
  }

  onError(fn) {
    this.onErrorHandle = (e) => {
      fn(e);
    };
  }
}
module.exports = BotBase;
