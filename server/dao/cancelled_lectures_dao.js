'use strict';

/**
 * Contains methods that access the CANCELLED_LECTURES table in the database
 */
const db = require('../db/db');
const CancelledLecture = require('../bean/cancelled_lectures');

/**
 * Creates, from the result of a query performed on the database, a new CancelledLectures object
 * 
 * @param row an Object corresponding to one tuple obtained from a query on the CANCELLED_LECTURES table
 */
function createCancelledLecture(row) {
    return new CancelledLecture(row.cancelledLectureId, row.courseId, row.teacherId, row.date, row.inPresence);
}

/**
 * Inserts in the database a new cancelled lecture
 * @param lecture a Lecture object, containing information about the cancelled lecture (identifier of the course, identifier of the teacher, date in which the lecture was supposed to take place, whether the lecture was supposed to be in presence or not)
 */
exports.addCancelledLecture = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO CANCELLED_LECTURES(courseId, teacherId, date, inPresence) VALUES( ?, ?, ?, ?)';
        let params = [];
        params.push(lecture.courseId, lecture.teacherId, lecture.date, lecture.inPresence);

        db.run(sql, params, function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
}

/**
 * Deletes a cancelled lecture from the database
 * @param cancelledLectureId an integer corresponding to the identifier of the cancelled lecture to be deleted
 */
exports.deleteCancelledLecture = function (cancelledLectureId) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM CANCELLED_LECTURES WHERE cancelledLectureId = ?";
        db.all(sql, [cancelledLectureId], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}

/**
 * Returns an array containing all cancelled lectures in the database, with no particular filtering
 */
exports.getCancelledLectures = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM CANCELLED_LECTURES";
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                if (rows) {
                    let _cancelledLectures = rows.map((row => createCancelledLecture(row)));
                    resolve(_cancelledLectures);
                } else {
                    resolve(undefined);
                }
            }
        })
    })
}
