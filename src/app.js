const path = require('path');
const electron = require('electron');
const url = require('url');
const ipc = electron.ipcMain;
const db = require('./core/db');
let tables = [];
let sender;

require('electron-context-menu')({
  prepend: (params, BrowserWindow) => {
    return [{
      label: 'Select', // select query
      visible: tables.includes(params.selectionText),
      click() {
        if (sender) {
          sender.send('selectTable', params.selectionText);
        }
      }
    }, {
      label: 'Insert', // open up popup for insert query
      visible: tables.includes(params.selectionText),
      click() {
        if (sender) {
          sender.send('insertInto', params.selectionText);
        }
      }
    }, {
      label: 'Query', // open up popup to run a custom SQL script
      visible: tables.includes(params.selectionText),
      click() {
        if (sender) {
          sender.send('selectTable', params.selectionText);
        }
      }
    }];
  }
});

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

async function execute(query) {
  const queryType = query.split(' ')[0].toLowerCase();
  let result;
  if (queryType === 'select') {
    result = await db.instance.all(query);
  }
  return result;
}

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
    tables = await db.instance.all(`SELECT name FROM sqlite_master WHERE type='table'`);
    tables = tables.map((t) => t.name);
    event.sender.send('dbConnect', result);
  });

  ipc.on('selectTable', (event) => {
    sender = event.sender;
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
      const result = await db.instance.run(`CREATE TABLE IF NOT EXISTS ${data.tableName} (${tableCols});`);
      tables.push(data.tableName);
      event.sender.send('createTable', { success: true });
    } catch (e) {
      event.sender.send('createTable', { success: false, error: e });
    }
  });

  ipc.on('getTables', async (event, data) => {
    event.sender.send('getTables', { tables });
  });

  ipc.on('getTableColumns', async (event, data) => {
    const result = await db.instance.all(`PRAGMA table_info(${data.tableName});`);
    const fKeys = await db.instance.all(`PRAGMA foreign_key_list(${data.tableName});`);
    event.sender.send('getTableColumns', { columns: result, tableName: data.tableName, fKeys: fKeys });
  });

  ipc.on('getTableContents', async (event, req) => {
    const columns = await db.instance.all(`PRAGMA table_info(${req.tableName});`);
    const data = await execute(`SELECT * from ${req.tableName};`);
    event.sender.send('getTableContents', {
      columns,
      data
    });
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
