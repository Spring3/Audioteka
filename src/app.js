const path = require('path');
const electron = require('electron');
const url = require('url');
const ipc = electron.ipcMain;
const db = require('./core/db');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 700 });
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file',
    slashes: true
  }));

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipc.on('dbConnect', async (event, dbName) => {
    const result = await db.connect(path.resolve(__dirname, '../data'), dbName);
    event.sender.send('dbConnect', result);
  });

  ipc.on('loadImgs', (event) => {
    event.sender.send('loadImgs', {
      gd: path.posix.join(__dirname, '../static/img/gd.jpg'),
      vd: path.posix.join(__dirname, '../static/img/vd.jpg'),
      ma: path.posix.join(__dirname, '../static/img/ma.jpg')
    });
  });

  ipc.on('createTable', async (event, data) => {
    try {
      const array = [];
      const fKeys = [];
      for ([key, c] of Object.entries(data.constraints)) {
        if (c.option === 'PRIMARY KEY') {
          c.option += ' AUTOINCREMENT';
          array.push(`${c.name} ${c.type} ${c.option}`);
        } else if (c.type === 'REFERENCES') {
          array.push(`${c.name} INTEGER NOT NULL`);
          fKeys.push(`FOREIGN KEY (${c.name}) REFERENCES ${c.option}(id)`);  
        } else {
          array.push(`${c.name} ${c.type} ${c.option}`);
        }
      }
      const tableCols = array.concat(fKeys).join(',');
      console.log(tableCols);
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
    const fKeys = await db.instance.all(`PRAGMA foreign_key_list(${data.tableName});`);
    event.sender.send('getTableColumns', { columns: result, tableName: data.tableName, fKeys: fKeys });
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
    if (db.instance) {
      db.instance.close();
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});