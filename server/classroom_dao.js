'use strict';

const db = require('./db');
const Classroom = require('./classroom');

exports.addClassroom = function(classroom) {
	return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO CLASSROOM(classroom, maxNumberOfSeats) VALUES(?, ?)';
        let params = [];
        console.log("New classroom: ", classroom);
        params.push(classroom.classroom, classroom.maxNumberOfSeats);

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

exports.deleteClassroom = function(classroom){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM CLASSROOM WHERE classroom = ?";
        db.all(sql, [classroom], (err, row) => {
            if(err)
                reject(err);
            else
               resolve(row);
        });
    });
}

exports.getMaxNumberOfSeats = function(classroom){
    return new Promise((resolve, reject) => {
        const sql = "SELECT maxNumberOfSeats FROM CLASSROOM WHERE classroom = ?";
        db.get(sql, [classroom], (err, row) => {
            if(err)
                reject(err);
            else{
                if(row)
                    resolve(row);
                else 
                    resolve(undefined);
            }
        });
    });
}