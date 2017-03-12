const db = require('sqlite');
const path = require('path');
const fs = require('fs');

let instance;

module.exports = {
  connect: async function (dbPath, dbname) {
    if (instance) return { success: true, instance };
    if (!dbname) return false;

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
      module.exports.instance = instance;
      return {
        success: true,
        instance
      };
    } catch (e) {
      return {
        success: false,
        message: e
      };
    }
  }
};