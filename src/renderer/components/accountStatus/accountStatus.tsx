import { Card, Col, Progress, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import ipcRenderer from 'renderer/utils/utils';
import BTCicon from '../../../../assets/BTC.svg';
import ETHicon from '../../../../assets/ETH.svg';
import USDTicon from '../../../../assets/USDT.svg';

const AccountStatus = () => {
  const [btc, setBTC] = useState({ usdt: 0, amount: 0, percent: 0, price: 0 });
  const [eth, setETH] = useState({ usdt: 0, amount: 0, percent: 0, price: 0 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [usdt, setUSDT] = useState({ amount: 0, percent: 0 });
  useEffect(() => {
    ipcRenderer.on('accountUpdated', (arg: any) => {
      const obj = JSON.parse(arg);
      const { BTCUSDT, ETHUSDT, USDT, TOTAL } = obj;
      setBTC({
        usdt: parseFloat(parseFloat(BTCUSDT.usdt).toFixed(2)),
        amount: parseFloat(parseFloat(BTCUSDT.amount).toFixed(6)),
        percent: parseFloat(parseFloat(BTCUSDT.percent).toFixed(4)) * 100,
        price: parseFloat(BTCUSDT.price),
      });
      setETH({
        usdt: parseFloat(parseFloat(ETHUSDT.usdt).toFixed(2)),
        amount: parseFloat(parseFloat(ETHUSDT.amount).toFixed(6)),
        percent: parseFloat(parseFloat(ETHUSDT.percent).toFixed(4)) * 100,
        price: parseFloat(ETHUSDT.price),
      });
      setUSDT({
        amount: parseFloat(parseFloat(USDT.amount).toFixed(2)),
        percent: parseFloat(parseFloat(USDT.percent).toFixed(4)) * 100,
      });
      setTotal(parseFloat(TOTAL.amount));
      setLoading(false);
      // setBTC(arg.BTC);
      // setETH(arg.ETH);
      // setUSDT(arg.USDT);
    });
    return () => {};
  }, []);

  return (
    <>
      <Col span={12}>
        <Card
          title="账户信息"
          bordered={false}
          style={{ height: 240 }}
          loading={loading}
        >
          <img src={ETHicon} alt="icon" style={{width:15,height:15}} /> ETH:{eth.amount}({eth.price})
          <Progress
            percent={eth.percent}
            strokeColor="#6c7ddc"
            status="active"
            format={() => {
              return eth.usdt.toString();
            }}
          />
          <img src={BTCicon} alt="icon" style={{width:15,height:15}} /> BTC:{btc.amount}({btc.price})
          <Progress
            percent={btc.percent}
            strokeColor="#e8973d"
            status="active"
            format={() => {
              return btc.usdt.toString();
            }}
          />
          <img src={USDTicon} alt="icon" style={{width:15,height:15}} /> USDT:{usdt.amount}
          <Progress
            percent={usdt.percent}
            strokeColor="#02C229"
            status="active"
            format={() => {
              return usdt.amount.toString();
            }}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card
          title="账户构成"
          bordered={false}
          style={{ height: 240 }}
          loading={loading}
        >
          <Row gutter={12}>
            <Col>
              <Progress
                percent={100 - eth.percent}
                success={{ percent: usdt.percent, strokeColor: '#02C229' }}
                trailColor="#6c7ddc"
                type="circle"
                strokeColor="#e8973d"
                format={() => {
                  return `${Math.abs(eth.percent - btc.percent).toFixed(2)}%`;
                }}
              />
            </Col>
            <Col>
              <p>BTC: {btc.percent.toFixed(2)}%</p>
              <p>ETH: {eth.percent.toFixed(2)}%</p>
              <p>USDT: {usdt.percent.toFixed(2)}%</p>
              <p>总价值: {total.toFixed(2)}USDT</p>
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  );
};
export default AccountStatus;
