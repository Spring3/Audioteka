const path = require('path');
const electron = require('electron');
const url = require('url');
const ipc = electron.ipcMain;
const { Menu, MenuItem, dialog } = electron;
const db = require('./core/db');
const fs = require('fs');

const reportFilePath = path.join(__dirname, '../report.txt');
fs.writeFile(reportFilePath, `Report from ${new Date().toISOString()}\n`, (error) => {});

let tables = [];
let sender;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

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
      label: 'New Query', // open up popup to run a custom SQL script
      visible: tables.includes(params.selectionText),
      click() {
        if (sender) {
          sender.send('customQuery', params.selectionText);
        }
      }
    }, {
      label: 'Properties', // select query
      visible: tables.includes(params.selectionText),
      click() {
        if (sender) {
          sender.send('openTable', params.selectionText);
        }
      }
    }];
  }
});

function addReport(string) {
  fs.appendFile(reportFilePath, `${string}\n`, (error) => {});
}

// Execute sql query
async function execute(query) {
  addReport(query);
  return await db.instance.all(query);
}

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 700 });
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file',
    slashes: true
  }));
  const template = [
    {
      label: 'Report',
      submenu: [
        {
          label: 'Show Report',
          click() {
              const report = fs.readFileSync(reportFilePath, 'utf8');
              dialog.showMessageBox(mainWindow, { title: 'Report', message: report });
          }
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // test database connection
  ipc.on('dbConnect', async (event, dbName) => {
    const result = await db.connect(path.resolve(__dirname, '../data'), dbName);
    const query = `SELECT name FROM sqlite_master WHERE type='table'`;
    addReport(query);
    tables = await db.instance.all(query);
    tables = tables.map((t) => t.name);
    event.sender.send('dbConnect', result);
  });

  // When user clicks select on the context menu, a table is marked as selected
  ipc.on('selectTable', (event) => {
    sender = event.sender;
  });

  // load imgs for about page
  ipc.on('loadImgs', (event) => {
    event.sender.send('loadImgs', {
      gd: path.posix.join(__dirname, '../static/img/gd.jpg'),
      vd: path.posix.join(__dirname, '../static/img/vd.jpg'),
      ma: path.posix.join(__dirname, '../static/img/ma.jpg')
    });
  });

  // create new table
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
      const query = `CREATE TABLE IF NOT EXISTS ${data.tableName} (${tableCols});`;
      addReport(query);
      const result = await db.instance.run(query);
      tables.push(data.tableName);
      event.sender.send('createTable', { success: true });
    } catch (e) {
      addReport(e.stack);
      event.sender.send('createTable', { success: false, error: e });
    }
  });

  // get existing tables
  ipc.on('getTables', async (event, data) => {
    event.sender.send('getTables', { tables });
  });

  // get columns of a table and info about it
  ipc.on('getTableColumns', async (event, data) => {
    let query = `PRAGMA table_info(${data.tableName});`;
    addReport(query);
    const result = await db.instance.all(query);
    query = `PRAGMA foreign_key_list(${data.tableName});`;
    addReport(query);
    const fKeys = await db.instance.all(query);
    event.sender.send('getTableColumns', { columns: result, tableName: data.tableName, fKeys: fKeys });
  });

  // select all from table
  ipc.on('getTableContents', async (event, req) => {
    let query = `PRAGMA table_info(${req.tableName});`;
    addReport(query);
    const columns = await db.instance.all(query);
    query = `SELECT * from ${req.tableName};`;
    const data = await execute(query);
    event.sender.send('getTableContents', {
      columns,
      data
    });
  });

  ipc.on('queryExecution', async (event, sqlQuery) => {
    let result;
    try {
      result = await execute(sqlQuery);
    } catch(e) {
      result = e;
      addReport(e.stack);
    } finally {
      event.sender.send('queryExecution:res', result);
    }
  });

  // drop table
  ipc.on('dropTable', async (event, data) => {
    try { 
      let query = `DROP TABLE IF EXISTS ${data.tableName};`;
      addReport(query);
      const result = await db.instance.run(query);
      event.sender.send('dropTable', { success: true, result });
    } catch (e) {
      addReport(e.stack);
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
