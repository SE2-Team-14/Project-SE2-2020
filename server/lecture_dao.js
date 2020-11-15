'use strict';

const db = require('./db');
const Lecture = require('./lecture');

function createLecture(row){
    return new Lecture(row.lectureId, row.courseId, row.teacherId, row.date, row.startingTime, row.endingTime, row.inPresence, row.classroomId, row.numberOfSeats);
}

exports.addLecture = function(lecture) {
	return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO LECTURE(lectureId, courseId, teacherId, date, startingTime, endingTime, inPresence, classroomId, numberOfSeats) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let params = [];
        console.log("New lecture: ", lecture);
        params.push(lecture.lectureId, lecture.courseId, lecture.teacherId, lecture.date, lecture.startingTime, lecture.endingTime, lecture.inPresence, lecture.classroomId, lecture.numberOfSeats);

        if (lecture) 
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                }
                else 
                    resolve(this.lastID);
        });
    });
}

exports.deleteLecture = function(lectureId){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM LECTURE WHERE lectureId = ?";
        db.all(sql, [lectureId], (err, row) => {
            if(err)
                reject(err);
            else
               resolve(row);
        });
    });
}

exports.getLectureById = function(lectureId){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM LECTURE WHERE lectureId = ?";
        db.all(sql, [lectureId], (err, row) => {
            if(err)
                reject(err);
            else{
                if(row)
                    resolve(createLecture(row));
                else 
                    resolve(undefined);
            }
        });
    });
}

exports.getLecturesList = function(email){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM LECTURE WHERE courseId IN (SELECT courseId FROM ENROLLMENT WHERE email = ?)";
        db.all(sql, [email], (err, rows) => {
            if(err)
                reject(err);
            else{
                if(rows.length>0){
                    let _lectures = rows.map((row => createLecture(row)));
                    resolve(_lectures);
                }
                else 
                    resolve(undefined);
            }
        });
    });
}

exports.increaseBookedSeats = function(lectureId){
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE LECTURE SET numberOfSeats = numberOfSeats + 1 WHERE lectureId = ?';
        db.run(sql, [lectureId], function(err) {
            if(err){
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

exports.decreaseBookedSeats = function(lectureId){
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE LECTURE SET numberOfSeats = numberOfSeats - 1 WHERE lectureId = ?';
        db.run(sql, [lectureId], function(err) {
            if(err){
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}