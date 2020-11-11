'use strict';

const db = require('./db');
const Classroom = require('./classroom');

function createClassroom(row){
    return new Classroom(row.classroomId, row.name, row.maxNumberOfSeats);
}

exports.addClassroom = function(classroom) {
	return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO CLASSROOM(name, maxNumberOfSeats) VALUES(?, ?)';
        let params = [];
        console.log("New classroom: ", classroom);
        params.push(classroom.name, classroom.maxNumberOfSeats);

        if (classroom) 
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                }
                else 
                    resolve(this.lastID);
        });
    });
}

exports.deleteClassroom = function(classroomId){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM CLASSROOM WHERE classroomId = ?";
        db.all(sql, [classroomId], (err, row) => {
            if(err)
                reject(err);
            else
               resolve(row);
        });
    });
}

exports.getClassroomByName = function(name){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM CLASSROOM WHERE name = ?";
        db.all(sql, [name], (err, row) => {
            if(err)
                reject(err);
            else{
                if(row)
                    resolve(createClassroom(row));
                else 
                    resolve(undefined);
            }
        });
    });
}
