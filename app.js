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

  ipc.on('createTable', async (event, data) => {
    try {
      const array = [];
      for ([key, c] of Object.entries(data.constraints)) {
        if (c.option === 'PRIMARY KEY') {
          c.option += ' AUTOINCREMENT';
        }
        array.push(`${c.name} ${c.type} ${c.option}`);
      }
      console.log(array);
      const tableCols = array.join(',');
      const result = await db.instance.run(`CREATE TABLE IF NOT EXISTS ${data.tableName} (${tableCols});`);
      event.sender.send('createTable', { success: true });
    } catch (e) {
      event.sender.send('createTable', { success: false });
    }
  });

  ipc.on('getTables', async (event, data) => {
    const result = await db.instance.all(`SELECT name FROM sqlite_master WHERE type='table'`); 
    event.sender.send('getTables', { tables: result });
  });

  ipc.on('getTableColumns', async (event, data) => {
    const result = await db.instance.all(`PRAGMA table_info(${data.tableName});`);
    event.sender.send('getTableColumns', { columns: result, tableName: data.tableName });
  });

  ipc.on('dropTable', async (event, data) => {
    try { 
      const result = await db.instance.run(`DROP TABLE IF EXISTS ${data.tableName};`);
      event.sender.send('dropTable', { success: true, result });
    } catch (e) {
      event.sender.send('dropTable', { success: false, result });
    }
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.instance.close();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});