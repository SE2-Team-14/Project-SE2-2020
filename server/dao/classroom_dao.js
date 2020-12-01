'use strict';

/**
 * Contains methods that access the CANCELLED_LECTURES table in the database
 */
const db = require('../db/db');
const Classroom = require('../bean/classroom');

/**
 * Creates, from the result of a query performed on the database, a new Classroom object
 * 
 * @param row an Object corresponding to one tuple obtained from a query on the CLASSROOM table
 */
function createClassroom(row) {
    return new Classroom(row.classroom, row.maxNumberOfSeats);
}

/**
 * Inserts a new classroom in the database
 * @param classroom a Classroom object containing information about the classroom (identifier and maximum number of seats/booked students allowed)
 */
exports.addClassroom = function (classroom) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO CLASSROOM(classroom, maxNumberOfSeats) VALUES(?, ?)';
        let params = [];
        params.push(classroom.classroom, classroom.maxNumberOfSeats);

        if (classroom)
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
 * Deletes a classroom from the database
 * @param classroom a string containing the identifier of the classroom to be deleted
 */
exports.deleteClassroom = function (classroom) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM CLASSROOM WHERE classroom = ?";
        db.all(sql, [classroom], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}

/**
 * Returns an array containing all classrooms in the database, with no particular filtering
 */
exports.getClassrooms = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM CLASSROOM";
        db.all(sql, [], (err, rows) => {
            if (err)
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