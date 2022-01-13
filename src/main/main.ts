/* eslint-disable @typescript-eslint/no-shadow */
/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const Store = require('electron-store');
const { Spot } = require('@binance/connector');

const store = new Store();
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
const TradeBot = require('./TradeBot/index');

const tb = new TradeBot(store.get('apiKey'), store.get('apiSecret'), {
  baseURL: 'Binance Address 币安api地址',
  url: store.get('url'),
});

const client = new Spot(store.get('apiKey'), store.get('apiSecret'), {
  baseURL: 'Binance Address 币安api地址',
});
type SymbolType = 'ETHUSDT' | 'ETHBTC' | 'BTCUSDT';
const dataSource = { ETHBTC: {}, BTCUSDT: {}, ETHUSDT: {} };
client
  .myTrades('ETHBTC')
  .then((res: any) => {
    dataSource.ETHBTC = res.data;
    return res.data;
  })
  .catch((err: any) => {
    if (mainWindow) mainWindow.webContents.send('errorReq', err);
  });
client
  .myTrades('BTCUSDT')
  .then((res: any) => {
    dataSource.BTCUSDT = res.data;
    return res.data;
  })
  .catch((err: any) => {
    if (mainWindow) mainWindow.webContents.send('errorReq', err);
  });
client
  .myTrades('ETHUSDT')
  .then((res: any) => {
    dataSource.ETHUSDT = res.data;
    return res.data;
  })
  .catch((err: any) => {
    if (mainWindow) mainWindow.webContents.send('errorReq', err);
  });

tb.onTrade((symbol: SymbolType) => {
  client
    .myTrades(symbol)
    .then((res: any) => {
      dataSource[symbol] = res.data;
      return res.data;
    })
    .catch((err: any) => {
      if (mainWindow) mainWindow.webContents.send('errorReq', err);
    });
});
tb.onTick((ms: number) => {
  const s: any = (ms / 1000).toFixed(0);
  const ss = s % 60;
  const mm = Math.floor(s / 60);
  const str = `${mm.toString().padStart(2, '0')}:${ss
    .toString()
    .padStart(2, '0')}`;
  if (mainWindow) mainWindow.webContents.send('tick', str);
});
let obj = { ETHBTC: {}, BTCUSDT: {}, ETHUSDT: {} };

tb.onUpdated((arg: Array<any>) => {
  obj = { ETHBTC: {}, BTCUSDT: {}, ETHUSDT: {} };
  arg.forEach((e: { symbol: SymbolType }) => {
    obj[e.symbol] = e;
  });
  if (mainWindow) {
    mainWindow.webContents.send('accountUpdated', JSON.stringify(obj));
    mainWindow.webContents.send(
      'dataSourceUpdated',
      JSON.stringify(dataSource)
    );
  }
});

tb.onError((err: any) => {
  if (mainWindow) mainWindow.webContents.send('errorReq', err);
});
// client 币安api
ipcMain.on('setApi', async (event, apiKey, apiSecret) => {
  store.set('apiKey', apiKey);
  store.set('apiSecret', apiSecret);
  event.reply('successReq', '设置成功！');
});
ipcMain.on('getApi', async (event) => {
  event.reply('getApi', [store.get('apiKey'), store.get('apiSecret')]);
});
// 通知webhookurl
ipcMain.on('setUrl', async (event, url) => {
  store.set('url', url);
  event.reply('successReq', '设置成功！');
});
ipcMain.on('getUrl', async (event) => {
  event.reply('getUrl', store.get('url'));
});
// 机器人状态
ipcMain.on('getBotStatus', (event) => {
  event.returnValue = tb.getBotStatus();
});
ipcMain.on('setBotStatus', async (e, value) => {
  switch (value) {
    case 0:
      tb.stopBot();
      break;
    case 1:
      tb.startBot();
      break;
    case 2:
      tb.pauseBot();
      break;
    default:
      console.log(value);
  }
  e.reply('successReq', '设置成功！');
  e.reply('botStatusChanged');
});
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}
const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 800,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/main/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
