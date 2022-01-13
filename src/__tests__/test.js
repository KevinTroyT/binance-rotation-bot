const { Spot } = require('@binance/connector');
const { Decimal } = require('decimal.js');

const apiKey =
  'MHkNrmxnnpXMz0MGZR3dQ6xutO2IQwKVCOdNvhd2S2yl6iHEZwv6QmQEqLxJaDfg';
const apiSecret =
  '6mlauF5YozMP5lsCEFSSaa7p7PRxE6z5fhOsNyDpQzzeerYDaPqEJd5S0tDeZilO';
const client = new Spot(apiKey, apiSecret, {
  baseURL: 'http://172.87.30.51:8012/',
});
const http = require('http');

// axios.get('https://api.binance.com/').then( res => {console.log(res)}).catch(e => console.log(e))
// Get account information

// 获取账号

let data;
let ETH;
let BTC;
let USDT;

class Coin {
  constructor(options) {
    const { symbol, amount, percent } = options;
    this.symbol = symbol;
    this.amount = amount;
    this.percent = percent || 0.5;
    this.update(this.amount);
  }

  getPrice = () => {
    return this.price;
  };

  getPriceInUSDT = () => {
    return this.price.times(this.amount);
  };

  getPercent = () => {
    return this.percent;
  };

  async update(amount) {
    if (amount instanceof Decimal) {
      this.amount = amount;
    }
    const promise = new Promise((resolve, reject) => {
      client
        .tickerPrice(this.symbol)
        .then((res) => {
          this.price = new Decimal(res.data.price);
          resolve(this);
        })
        .catch((e) => {
          console.log(e);
          reject(e);
        });
    });
  }
}

client
  .account()
  .then((response) => {
    data = response.data;
    // data = [data.balances[11],data.balances[0],data.balances[2]]
    USDT = new Decimal(data.balances[11].free);
    ETH = new Coin({
      symbol: 'ETHUSDT',
      amount: new Decimal(data.balances[2].free),
    });
    BTC = new Coin({
      symbol: 'BTCUSDT',
      amount: new Decimal(data.balances[0].free),
    });
    return 123;
  })
  .catch((e) => {
    console.log(e);
  });

// client.tickerPrice('BTCUSDT').then(response => {
//     data1 = response.data
// }).catch (e => {
//     console.log(e)
// });

// client.tickerPrice('ETHUSDT').then(response => {
//     data2 = response.data
// }).catch (e => {
//     console.log(e)
// });

// client.tickerPrice('ETHBTC').then(response => {
//     data3 = response.data
// }).catch (e => {
//     console.log(e)
// });

// USDT : data[0]
// BTC : data[1]
// ETH : data[2]

// ETH in USDT: data[2].free * data[2].price
// BTC in USDT: data[1].free * data[1].price

const hostname = '127.0.0.1';
const port = 1337;

http
  .createServer((req, res) => {
    // let BTCamout = new Decimal(data[2].free)
    // let ETHamout = new Decimal(data[1].free)
    // let BTCpercents = 0.5
    // let ETHpercents = 0.5
    // let BTCInUSDT = new Decimal(data[1].free) * new Decimal(data1.price)
    // let ETHInUSDT = new Decimal(data[2].free) * new Decimal(data2.price)
    // let BTCprice = new Decimal(data1.price)
    // let ETHprice = new Decimal(data2.price)

    // let checkPercent = (ETHamout,BTCamout,BTCprice,ETHprice,BTCpercents,ETHpercents) => {
    //     let BTCInUSDT = BTCprice * BTCamout
    //     let ETHInUSDT = ETHprice * ETHamout
    //     console.log('BTCInUSDT',BTCInUSDT)
    //     console.log('ETHInUSDT',ETHInUSDT)
    //     let Total = BTCInUSDT+ETHInUSDT
    //     let ETHPercent = ETHInUSDT/BTCInUSDT+ETHInUSDT
    //     let BTCPercent = BTCInUSDT/BTCInUSDT+ETHInUSDT
    //     let percentNow = {ETH: ETHPercent ,BTC: BTCPercent, Total:(BTCInUSDT+ETHInUSDT)/2}
    //     return percentNow
    // }

    // console.log(checkPercent(ETHamout,BTCamout,BTCprice,ETHprice,BTCpercents,ETHpercents))
    const total = BTC.getPriceInUSDT().plus(ETH.getPriceInUSDT());
    checkPercent = (coin, total) => {
      console.log(coin.getPriceInUSDT().div(total));
    };
    checkPercent(ETH, total);
    console.log(ETH.getPercent());
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const json = JSON.stringify({
      // data: [data1,data2,data3],
      // account: data,
    });
    res.end(json);
  })
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
