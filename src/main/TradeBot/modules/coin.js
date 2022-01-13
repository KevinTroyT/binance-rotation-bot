const { Decimal } = require('decimal.js');

class Coin {
  constructor(options) {
    const { symbol, amount, percent, client } = options;
    this.symbol = symbol;
    this.amount = amount;
    this.percent = percent || 0.5;
    this.client = client;
    this.update(this.amount);
  }

  getPrice() {
    return this.price;
  }

  getPriceInUSDT() {
    return this.price.times(this.amount);
  }

  getPercent() {
    return this.percent;
  }

  update(amount) {
    if (amount instanceof Decimal) {
      this.amount = amount;
    }
    const promise = new Promise((resolve, reject) => {
      this.client
        .tickerPrice(this.symbol)
        .then((res) => {
          this.price = new Decimal(res.data.price);
          resolve(this);
          return this.price;
        })
        .catch((e) => {
          reject(e);
        });
    });
    return promise;
  }
}
module.exports = Coin;
