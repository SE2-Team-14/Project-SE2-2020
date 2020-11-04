'use strict';

const db = require('./db');
const Officer = require('./officer');
const bcrypt = require('bcrypt');

function createOfficer(row){
    return new Officer(row.officerId, row.name, row.surname, row.manager == "true", row.email, row.password);
}



exports.getOfficerByID = function(officerID){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Officer WHERE officerID = ?";
        db.all(sql, [officerID], (err, row) => {
            if(err)
                reject(err);
            else {
                if(row)
                    resolve(createOfficer(row));
                else    
                    resolve(undefined);
            }
        });
    });
}

exports.getOfficerByEmail = function(email) {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM Officer WHERE email = ?";
		db.all(sql , [email], (err, rows) => {
				if(err) 
					reject(err);
				else{
					if(rows.length>0){
                        let officer = rows.map((row => createOfficer(row)))[0];
                        console.log(officer);
						resolve(officer);
					} else
						resolve(undefined);
				}
		});
	});
}

//exports.checkPassword = function(officer, password){
//    let hash = bcrypt.hashSync(password, 10);
//    return bcrypt.compareSync(password, officer.password);
//}