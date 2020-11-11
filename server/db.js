'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('./db/database.db', (err) => {
    if (err) {
        console.log("Something went wrong" + err);
        throw err;
    }
});

module.exports = db;