/* eslint-disable react-hooks/rules-of-hooks */
import { Radio, RadioChangeEvent } from 'antd';
import React, { useEffect, useState } from 'react';
import ipcRenderer from 'renderer/utils/utils';

const BotSwitch = () => {
  const checkBotStatus = () => {
    return ipcRenderer.getBotStatus();
  };

  const [botStatus, setBot] = useState(checkBotStatus());
  useEffect(() => {
    ipcRenderer.on('botStatusChanged', () => {
      checkBotStatus();
      setBot(checkBotStatus());
    });
    return () => {};
  }, []);
  const setBotStatus = (arg: RadioChangeEvent) => {
    ipcRenderer.setBotStatus(arg.target.value);
  };
  return (
    <>
      <Radio.Group value={botStatus} onChange={setBotStatus}>
        <Radio.Button value={0}>停止</Radio.Button>
        <Radio.Button value={1}>
          {botStatus === 0 && '开始'}
          {botStatus === 1 && '开始'}
          {botStatus === 2 && '继续'}
        </Radio.Button>
        <Radio.Button value={2} disabled={botStatus === 0}>
          暂停
        </Radio.Button>
      </Radio.Group>
    </>
  );
};
export default BotSwitch;
