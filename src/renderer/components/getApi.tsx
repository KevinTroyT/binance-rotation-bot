import React, { useState } from 'react';
import { Button, Input, notification } from 'antd';
import getAccount from '../service/service';

function getApi() {
  const [apiKey, setApiKey] = useState();
  const [apiSecret, setApiSecret] = useState();
  window.electron.ipcRenderer.on('getApiKey', (arg: any) => {
    setApiKey(arg);
  });
  window.electron.ipcRenderer.on('getApiSecret', (arg: any) => {
    setApiSecret(arg);
  });
  const getApi = () => {
    window.electron.ipcRenderer.getApi();
  };
  window.electron.ipcRenderer.on('getApiTest', (arg: any) => {
    console.log(arg);
  });
  window.electron.ipcRenderer.on('successReq', (arg: any) => {
    notification.success({
      message: '请求成功',
      description: arg,
    });
  });
  window.electron.ipcRenderer.on('errorReq', (arg: any) => {
    console.log(arg);
    notification.error({
      message: '请求出错',
      description: `${arg}`,
    });
  });
  getAccount();
  fetch(`https://api.binance.com`).then((response) => console.log(response));
  window.electron.ipcRenderer.on();
  return (
    <>
      {apiKey && apiSecret ? (
        <>
          <h1>
            hello {apiKey},{apiSecret}
          </h1>
          <Input id="key" placeholder="key" />
          <Input id="sec" placeholder="sec" />
          <Button
            type="primary"
            onClick={() => {
              window.electron.ipcRenderer.setApi(
                document.getElementById('key')?.value,
                document.getElementById('sec')?.value
              );
              getApi();
            }}
          >
            update
          </Button>
          <Button
            type="primary"
            onClick={() => {
              window.electron.ipcRenderer.setApi(null, null);
              getApi();
            }}
          >
            delete
          </Button>
        </>
      ) : (
        <>
          <Input id="key" placeholder="key" />
          <Input id="sec" placeholder="sec" />
          <Button
            type="primary"
            onClick={() => {
              window.electron.ipcRenderer.setApi(
                document.getElementById('key')?.value,
                document.getElementById('sec')?.value
              );
              getApi();
            }}
          >
            setAPI
          </Button>
        </>
      )}
    </>
  );
}
export default getApi;
