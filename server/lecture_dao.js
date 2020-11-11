'use strict';

const db = require('./db');
const Lecture = require('./lecture');

function createLecture(row){
    return new Lecture(row.courseId, row.teacherId, row.date, row.startingTime, row.endingTime, row.inPresence, row.classroomId, row.numberofSeats);
}

exports.addLecture = function(lecture) {
	return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO LECTURE(courseId, teacherId, date, startingTime, endingTime, inPresence, classroomId, numberOfSeats) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        let params = [];
        console.log("New lecture: ", lecture);
        params.push(lecture.courseId, lecture.teacherId, lecture.date, lecture.startingTime, lecture.endingTime, lecture.inPresence, lecture.classroomId, lecture.numberofSeats);

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

exports.getLecturesList = function(studentId){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM LECTURE WHERE courseId IN (SELECT courseId FROM ENROLLMENT WHERE studentId = ?";
        db.all(sql, [studentId], (err, rows) => {
            if(err)
                reject(err);
            else{
                if(rows.length>0){
                    let _lectures = rows.map((row => createLecture(row)))[0];
                    resolve(_lectures);
                }
                else 
                    resolve(undefined);
            }
        });
    });
}