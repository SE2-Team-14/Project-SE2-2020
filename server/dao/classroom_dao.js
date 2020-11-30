'use strict';

const db = require('../db/db');
const Classroom = require('../bean/classroom');

function createClassroom(row){
    return new Classroom(row.classroom, row.maxNumberOfSeats);
}
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

exports.getClassrooms = function(){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM CLASSROOM";
        db.all(sql, [], (err, rows) => {
            if(err)
                reject(err);
            else
                resolve(rows.map((row => createClassroom(row))))
        })
    })
}
/*
exports.getMaxNumberOfSeats = function(classroom){
    return new Promise((resolve, reject) => {
        const sql = "SELECT maxNumberOfSeats FROM CLASSROOM WHERE classroom = ?";
        db.all(sql, [classroom], (err, row) => {
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
}*/