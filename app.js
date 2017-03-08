const path = require('path');
const electron = require('electron');
const url = require('url');
const ipc = electron.ipcMain;
const db = require('./src/core/db');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }));

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipc.on('dbConnect', async (event, dbName) => {
    const result = await db.connect(path.resolve(__dirname, './data'), dbName);
    event.sender.send('dbConnect', result);
  });

  ipc.on('loadImgs', (event) => {
    event.sender.send('loadImgs', {
      gd: path.join(__dirname, 'src/img/gd.jpg'),
      vd: path.join(__dirname, 'src/img/vd.jpg'),
      ma: path.join(__dirname, 'src/img/ma.jpg')
    });
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});