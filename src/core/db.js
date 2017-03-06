const db = require('sqlite');
const path = require('path');
const fs = require('fs');

let instance;

module.exports = {
  connect: async function (dbPath, dbname) {

    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath);
    }

    const nameParts = dbname.split('.');
    if (nameParts[nameParts.length - 1] !== 'sqlite') {
      dbname += '.sqlite';
    }

    dbPath = path.resolve(dbPath, dbname);
    
    try {
      instance = await db.open(dbPath);
      return instance;
    } catch (e) {
      return e;
    }
  }
};