'use strict';

const db = require('./db');
const student = require('./student');

function createStudent(row){
    return new Student(row.studentId, row.name, row.surname, row.email, row.password);
}

exports.createStudent = function(student) {
	return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO STUDENT(studentId, name, surname, email, password) VALUES(?, ?, ?, ?, ?)';
        let params = [];
        console.log("new Student: ", student);
        params.push(student.studentId, student.name, student.surname, student.email, student.password);

        if (student) 
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.lastID);
                }
        });
    });
}

exports.deleteStudentById = function(studentId){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM STUDENT WHERE studentId = ?";
        db.all(sql, [studentId], (err, row) => {
            if(err)
                reject(err);
            else(row)
               resolve();
        });
    });
}

exports.getStudentByID = function(studentId){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM STUDENT WHERE studentId = ?";
        db.all(sql, [studentId], (err, row) => {
            if(err)
                reject(err);
            else{
                if(row)
                    resolve(createStudent(row));
                else 
                    resolve(undefined);
            }
        });
    });
}

exports.getStudentByEmail = function(email) {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM STUDENT WHERE email = ?";
		db.all(sql , [email], (err, rows) => {
				if(err) 
					reject(err);
				else{
					if(rows.length>0){
                        let student = rows.map((row => createStudent(row)))[0];
                        console.log(student);
						resolve(student);
					} else
						resolve(undefined);
				}
		});
	});
}