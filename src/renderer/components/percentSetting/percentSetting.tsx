/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Radio, RadioChangeEvent, Slider, Tooltip } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { useEffect, useState } from 'react';
import ipcRenderer from 'renderer/utils/utils';

const PercentSetting = (props: any) => {
  function formatter(value: any) {
    return `${value}%`;
  }
  return (
    // eslint-disable-next-line react/destructuring-assignment
    <Content style={props.style}>
      BTC: <Slider tipFormatter={formatter} value={50} />
      ETH: <Slider tipFormatter={formatter} value={50} />
      进行平衡比例: <Slider tipFormatter={formatter} value={2} />
      <Tooltip placement="topLeft" title="即将支持！">
        <Button type="primary" disabled>
          修改
        </Button>
      </Tooltip>
    </Content>
  );
};
export default PercentSetting;
