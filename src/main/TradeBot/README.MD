# 轮动机器人本体-TradeBot🤖️


#### 基本逻辑:
5分钟进行一次轮动将持仓比例调整至 1:1 并且将多余的USDT平均分配到ETH和BTC上.
倒数到18秒确认交易数量以及发送信息至企业微信 0秒发送交易.

在不方便接入币安的地方使用建议把 **api.binance.com** 通过海外服务器中间件转发,然后直接连你的服务器(亲测有效).

**由于apiKey和apiSecret都需要提供**,而且能够**进行交易**,建议不要直接把程序放在国外服务器跑!!!

[交易机器人开箱即用](https://github.com/KevinTroyT/binance-rotation-bot)

# Usage🚀

    const  TradeBot = require('./TradeBot/index');
    const  tb = new TradeBot(apiKey, apiSecret, {
    	baseURL:  'api.binance.com',
    });


# 参数说明💡

    new TradeBot(apiKey, apiSecret, {
        	baseURL:  '币安api地址',
        	tradeOver: '发起交易价格差 默认0.02',
        	url: '企业微信机器人webhook'
    });
