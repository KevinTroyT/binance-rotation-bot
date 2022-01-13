/* eslint-disable react-hooks/rules-of-hooks */
import { Badge, Divider, Layout, notification, Row } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import SetApi from 'renderer/components/setApi/setApi';
import BotSwitch from 'renderer/components/botSwitch/botSwitch';
import { Header } from 'antd/lib/layout/layout';
import ipcRenderer from 'renderer/utils/utils';
import PercentSetting from '../percentSetting/percentSetting';
import NotificationSetting from '../notificationSetting/notificationSetting';
import AccountStatus from '../accountStatus/accountStatus';
import TradeHistory from '../tradeHistroy/tradeHistory';
import icon from '../../../../assets/icon.svg';

const { Content, Sider } = Layout;
ipcRenderer.on('successReq', (arg: any) => {
  notification.success({
    message: '请求成功',
    description: arg,
  });
});
ipcRenderer.on('errorReq', (arg: any) => {
  notification.error({
    message: '请求出错',
    description: `${arg}`,
  });
});
const checkBotStatus = (botStatus: number) => {
  switch (botStatus) {
    case 0:
      return <Badge status="error" text="离线" />;
    case 1:
      return <Badge status="success" text="在线" />;
    case 2:
      return <Badge status="warning" text="暂停" />;
    default:
      return null;
  }
};
const layout = () => {
  const [ticks, setTick] = useState('00:00');
  const [botStatus, setBot] = useState(ipcRenderer.getBotStatus());
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  useEffect(() => {
    ipcRenderer.on('tick', (arg: any) => {
      setTick(arg);
    });
    ipcRenderer.on('botStatusChanged', () => {
      setBot(ipcRenderer.getBotStatus());
    });
    return () => {};
  }, []);
  return (
    <Layout>
      <Sider
        width={300}
        style={{
          overflow: 'scroll',
          minHeight: '100vh',
          position: 'fixed',
          left: 0,
          textAlign: 'center',
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <img
          style={{ width: collapsed ? 48 : 72 }}
          src={icon}
          alt="icon"
          className="logo"
        />
        <Divider style={{ visibility: collapsed ? 'hidden' : 'visible' }}>
          Api设置
        </Divider>

        <SetApi style={{ display: collapsed ? 'none' : 'block' }} />
        <Divider style={{ visibility: collapsed ? 'hidden' : 'visible' }}>
          机器人开关
        </Divider>
        <BotSwitch />
        <Divider style={{ visibility: collapsed ? 'hidden' : 'visible' }}>
          比例设置
        </Divider>
        <PercentSetting style={{ display: collapsed ? 'none' : 'block' }} />
        <Divider style={{ display: collapsed ? 'none' : 'block' }}>
          通知设置
        </Divider>
        <NotificationSetting
          style={{ visibility: collapsed ? 'hidden' : 'visible' }}
        />
      </Sider>
      <Layout
        className="site-layout"
        style={{ marginLeft: collapsed ? 80 : 300 }}
      >
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: toggle,
              style: {
                marginRight: 40,
              },
            }
          )}
          下一次自动检查平衡时间：{ticks}
          <text style={{ marginLeft: 410 }}>
            机器人状态: {checkBotStatus(botStatus)}
          </text>
        </Header>
        <Content
          style={{ margin: '72px 16px 0', overflow: 'initial', padding: 24 }}
        >
          <Row gutter={[24, 48]}>
            <AccountStatus />
          </Row>
          <Divider />
          <Row gutter={[24, 48]}>
            <TradeHistory />
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};
export default layout;
