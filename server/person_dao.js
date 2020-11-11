'use strict';

const db = require('./db');
const Person = require('./person');

function createPerson(row){
    return new Person(row.id, row.name, row.surname, row.role, row.email, row.password);
}

exports.createPerson = function(person) {
	return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO PERSON(id, name, surname, role, email, password) VALUES(?, ?, ?, ?, ?, ?)';
        let params = [];
        console.log("New university member: ", person);
        params.push(person.id, person.name, person.surname, person.role, person.email, person.password);

        if (person) 
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                }
                else 
                    resolve(this.lastID);
        });
    });
}

exports.deletePersonById = function(id){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM PERSON WHERE id = ?";
        db.all(sql, [id], (err, row) => {
            if(err)
                reject(err);
            else
               resolve(row);
        });
    });
}

exports.getPersonByID = function(id){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM PERSON WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if(err){
                reject(err);
            } else {
                if(row){
                    resolve(createPerson(row));
                } else { 
                    resolve(undefined);
                }
            }
        });
    });
}

exports.getPersonByEmail = function(email) {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM PERSON WHERE email = ?";
		db.all(sql , [email], (err, rows) => {
				if(err) 
					reject(err);
				else{
					if(rows.length>0){
                        let _person = rows.map((row => createPerson(row)))[0];
                        console.log(_person);
						resolve(_person);
					} else
						resolve(undefined);
				}
		});
	});
}
