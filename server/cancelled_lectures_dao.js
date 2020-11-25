'use strict';

const db = require('./db');
const CancelledLecture = require('./cancelled_lectures');

function createCancelledLecture(row){
    return new CancelledLecture(row.cancelledLectureId, row.courseId, row.teacherId, row.date, row.inPresence);
}

exports.addCancelledLecture = function(lecture) {
	return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO CANCELLED_LECTURES(cancelledLectureId, courseId, teacherId, date, inPresence) VALUES(?, ?, ?, ?, ?)';
        let params = [];
        console.log("Add a cancelled lecture: ", lecture);
        params.push(lecture.cancelledLectureId, lecture.courseId, lecture.teacherId, lecture.date, lecture.inPresence);

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

exports.deleteCancelledLecture = function(cancelledLectureId){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM CANCELLED_LECTURES WHERE cancelledLectureId = ?";
        db.all(sql, [cancelledLectureId], (err, row) => {
            if(err)
                reject(err);
            else
               resolve(row);
        });
    });
}

exports.getCancelledLectures = function() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM CANCELLED_LECTURES";
        db.all(sql, [], (err, rows) => {
            if(err)
                reject(err);
            else {
                if(rows){
                    let _cancelledLectures = rows.map((row => createCancelledLecture(row)));
                    resolve(_cancelledLectures);
                } else {
                    resolve(undefined);
                }
            }
        })
    })
}
