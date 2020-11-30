'use strict';
// Import the filesystem module 
const fs = require('fs'); 
const dbsettings = require('./dbsettings');
const sqlite = require('sqlite3');

const testdb = 'tmpdb.db';
const productiondb = 'testdb.db';
const path = (dbsettings.test ? testdb : productiondb);


if(dbsettings.test){ 
    // the file paths are relative to server folder
    fs.copyFileSync('./db/' + productiondb, './db/' + testdb); // copy the old database in the new file
}


const db = new sqlite.Database(`${path}`, (err) => {
    if (err) {
        console.log("Something went wrong" + err);
        throw err;
    }
});

// adding a method to remove de database from the filesystem
db.deleteFromDisk = () => {
    // the file paths are relative to server folder
    fs.unlinkSync('./db/'+path);
}

module.exports = db;