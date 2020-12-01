'use strict';

/**
 * Contains methods that access the PERSON table in the database
 */
const db = require('../db/db');
const Person = require('../bean/person');

/**
 * Creates, from the result of a query performed on the database, a new Person object
 * 
 * @param row an Object corresponding to one tuple obtained from a query on the PERSON table
 */
function createPerson(row) {
    return new Person(row.id, row.name, row.surname, row.role, row.email, row.password);
}

/**
 * Inserts information about a new person involved with the booking system in the database
 * @param person a Person object containing all information to be inserted (identifier, name and surname, role in the system, email and password used during the login to access the system)
 */
exports.createPerson = function (person) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO PERSON(id, name, surname, role, email, password) VALUES(?, ?, ?, ?, ?, ?)';
        let params = [];
        params.push(person.id, person.name, person.surname, person.role, person.email, person.password);

        if (person)
            db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                }
                else
                    resolve(this.lastID);
            });
    });
}

/**
 * Removes a person from the database
 * @param id a string containing the identifier of the person to be deleted
 */
exports.deletePersonById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM PERSON WHERE id = ?";
        db.all(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}

/**
 * Returns a Person object containing all information about a person involved with the booking system 
 * @param id a string containing the identifier of the person whose information is to be retrieved
 */
exports.getPersonByID = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM PERSON WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {
                    resolve(createPerson(row));
                } else {
                    resolve(undefined);
                }
            }
        });
    });
}

/**
 * Returns a Person object containing information about a person involved with the booking system by using that person's email
 * @param email a string containing the email of the person whose information is to be retrieved
 */
exports.getPersonByEmail = function (email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM PERSON WHERE email = ?";
        db.all(sql, [email], (err, rows) => {
            if (err)
                reject(err);
            else {
                if (rows.length > 0) {
                    let _person = rows.map((person => createPerson(person)))[0];
                    resolve(_person);
                } else {
                    resolve(undefined);
                }
            }
        });
    });
}

/**
 * Returns an array of Person objects containing information about all people involved with the booking system with the role of Teacher
 */
exports.getTeachers = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM PERSON WHERE role = 'Teacher'";
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                if (rows) {
                    let teacher = rows.map((row => createPerson(row)));
                    resolve(teacher);
                } else {
                    resolve(undefined);
                }
            }
        })
    })
}
