import { Card, Col, Progress, Row, Table, Tabs, Tag } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';

import React, { useEffect, useState } from 'react';
import ipcRenderer from 'renderer/utils/utils';
import { format } from 'prettier';
import formatDate from './datasource';

const { TabPane } = Tabs;

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '订单号',
    dataIndex: 'orderId',
    key: 'orderId',
  },
  {
    title: '成交价格',
    dataIndex: 'price',
    key: 'price',
    render: (e: any) => {
      const str = `${e}`;
      return str.slice(0, 8);
    },
  },
  {
    title: '成交量',
    dataIndex: 'qty',
    key: 'qty',
    render: (e: any) => {
      const str = `${e}`;
      return str.slice(0, 6);
    },
  },
  {
    title: '成交金额',
    dataIndex: 'quoteQty',
    key: 'quoteQty',
  },
  {
    title: '交易时间',
    dataIndex: 'time',
    key: 'time',
    defaultSortOrder: 'descend',
    sorter: (a: any, b: any) => {
      return a.time - b.time;
    },
    render: (time: any) => {
      return formatDate(time);
    },
  },
  {
    title: '方向',
    dataIndex: 'isBuyer',
    key: 'isBuyer',
    // eslint-disable-next-line react/display-name
    render: (tags: boolean) => {
      if (tags) {
        return <Tag color="volcano">购买</Tag>;
      }
      return <Tag color="geekblue">卖出</Tag>;
    },
  },
];

const TradeHistory = () => {
  const [ethbtc, setETHBTC] = useState({});
  const [ethusdt, setETHUSDT] = useState({});
  const [btcusdt, setBTCUSDT] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    ipcRenderer.on('dataSourceUpdated', (arg: any) => {
      const obj = JSON.parse(arg);
      setETHBTC(obj.ETHBTC);
      setBTCUSDT(obj.BTCUSDT);
      setETHUSDT(obj.ETHUSDT);
      setLoading(false);
    });
    return () => {};
  }, []);

  return (
    <>
      <Col span={24}>
        <Card title="交易历史" bordered={false} loading={loading}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="ETH/BTC" key="1">
              <Table dataSource={ethbtc} columns={columns} />
            </TabPane>
            <TabPane tab="BTC/USDT" key="2">
              <Table dataSource={ethusdt} columns={columns} />
            </TabPane>
            <TabPane tab="ETH/USDT" key="3">
              <Table dataSource={btcusdt} columns={columns} />
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};
export default TradeHistory;
