const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    setApi(apiKey, apiSecret) {
      ipcRenderer.send('setApi', apiKey, apiSecret);
    },
    getApi() {
      ipcRenderer.send('getApi');
    },

    setUrl(url) {
      ipcRenderer.send('setUrl', url);
    },
    getUrl() {
      ipcRenderer.send('getUrl');
    },

    getBotStatus() {
      return ipcRenderer.sendSync('getBotStatus');
    },
    setBotStatus(value) {
      ipcRenderer.send('setBotStatus', value);
    },

    on(channel, func) {
      const validChannels = [
        'getApi',
        'setApi',
        'successReq',
        'errorReq',
        'tick',
        'botStatusChanged',
        'getUrl',
        'accountUpdated',
        'dataSourceUpdated',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = [
        'getApi',
        'setApi',
        'successReq',
        'errorReq',
        'tick',
        'botStatusChanged',
        'getUrl',
        'accountUpdated',
        'dataSourceUpdated',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
