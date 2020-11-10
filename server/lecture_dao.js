'use strict';

const db = require('./db');
const Lecture = require('./lecture');

function createLecture(row){
    return new Lecture(row.courseId, row.teacherId, row.date, row.startingTime, row.endingTime, row.inPresence, row.classroom);
}

exports.addLecture = function(lecture) {
	return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO LECTURE(courseId, teacherId, date, startingTime, endingTime, inPresence, classroom) VALUES(?, ?, ?, ?, ?, ?, ?)';
        let params = [];
        console.log("New lecture: ", lecture);
        params.push(lecture.courseId, lecture.teacherId, lecture.date, lecture.startingTime, lecture.endingTime, lecture.inPresence, lecture.classroom);

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
