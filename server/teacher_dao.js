'use strict';

const db = require('./db');
const teacher = require('./teacher');

function createTeacher(row){
    return new Teacher(row.teacherId, row.name, row.surname, row.email, row.password);
}

exports.createTeacher = function(teacher) {
	return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO TEACHER(teacherId, name, surname, email, password) VALUES(?, ?, ?, ?, ?)';
        let params = [];
        console.log("new Teacher: ", teacher);
        params.push(teacher.teacherId, teacher.name, teacher.surname, teacher.email, teacher.password);

        if (teacher) 
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

exports.deleteTeacherById = function(teacherId){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM TEACHER WHERE teacherId = ?";
        db.all(sql, [teacherId], (err, row) => {
            if(err)
                reject(err);
            else(row)
               resolve();
        });
    });
}

exports.getTeacherById = function(teacherId){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM TEACHER WHERE teacherId = ?";
        db.all(sql, [teacherId], (err, row) => {
            if(err)
                reject(err);
            else{
                if(row)
                    resolve(createTeacher(row));
                else 
                    resolve(undefined);
            }
        });
    });
}

exports.getTeacherByEmail = function(email) {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM TEACHER WHERE email = ?";
		db.all(sql , [email], (err, rows) => {
				if(err) 
					reject(err);
				else{
					if(rows.length>0){
                        let teacher = rows.map((row => createTeacher(row)))[0];
                        console.log(teacher);
						resolve(teacher);
					} else
						resolve(undefined);
				}
		});
	});
}