# 轮动机器人🤖️

Frontend build from Electron React Boilerplate

接近于开箱即用的轮动机器人解决方案
![基本菜单](https://raw.githubusercontent.com/KevinTroyT/binance-rotation-bot/master/doc/image/menu.png)
![账户信息](https://raw.githubusercontent.com/KevinTroyT/binance-rotation-bot/master/doc/image/menu2.jpg)
#### 基本逻辑: 
5分钟进行一次轮动将持仓比例调整至 1:1 并且将多余的USDT平均分配到ETH和BTC上.
倒数到18秒确认交易数量以及发送信息至企业微信 0秒发送交易.

在不方便接入币安的地方使用建议把 **api.binance.com** 通过海外服务器中间件转发,然后直接连你的服务器(亲测有效).

**由于apiKey和apiSecret都需要提供**,而且能够**进行交易**,建议不要直接把程序放在国外服务器跑!!!

[交易机器人本体(node-js)](https://github.com/KevinTroyT/binance-rotation-bot/tree/master/src/main/TradeBot)

# Usage🚀
git clone \n
yarn
yarn start
修改apiKey apiSecret 
**如果有需要的话增加企业微信webhook地址**
 保存后重启
单击开始~

# TODO

|类型|状态| 描述 | 
|--|--| -- |
|feature| ❌ | 增加其他的webhook |
|feature| ❌ | 可以修改比例 |
|feature| ❌ | 改成多币轮动 |
|feature| ❌ | 增加release |
