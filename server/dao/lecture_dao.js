'use strict';

const db = require('../db/db');
const Lecture = require('../bean/lecture');
const moment = require('moment');

function createLecture(row) {
    return new Lecture(row.lectureId, row.courseId, row.teacherId, row.date, row.startingTime, row.endingTime, row.inPresence, row.classroomId, row.numberOfSeats);
}

exports.addLecture = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO LECTURE(lectureId, courseId, teacherId, date, startingTime, endingTime, inPresence, classroomId, numberOfSeats) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let params = [];
        //console.log("New lecture: ", lecture);
        params.push(lecture.lectureId, lecture.courseId, lecture.teacherId, lecture.date, lecture.startingTime, lecture.endingTime, lecture.inPresence, lecture.classroomId, lecture.numberOfSeats);

        if (lecture)
            db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                }
                else
                    resolve(this.lastID);
            });
    });
}

exports.deleteLecture = function (lectureId) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM LECTURE WHERE lectureId = ?";
        db.run(sql, [lectureId], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(undefined);
        });
    });
}

exports.getLectureById = function (lectureId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM LECTURE WHERE lectureId = ?";
        db.get(sql, [lectureId], (err, row) => {
            if (err)
                reject(err);
            else {
                if (row)
                    resolve(createLecture(row));
                else
                    resolve(undefined);
            }
        });
    });
}

exports.getLecturesList = function (email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM LECTURE WHERE inPresence = 1 AND courseId IN (SELECT courseId FROM ENROLLMENT WHERE email = ?)";
        db.all(sql, [email], (err, rows) => {
            if (err)
                reject(err);
            else {
                if (rows) {
                    let today = moment().subtract(1, 'days');
                    let newRow = [];
                    for (let i = 0; i < rows.length; i++) {
                        let date = moment(rows[i]["date"], "DD/MM/YYYY")
                        if (today.isBefore(date)) {
                            newRow.push(rows[i])
                        }
                    }
                    resolve(newRow);
                }
                else
                    resolve(undefined);
            }
        });
    });
}

exports.getTeacherLectureList = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM LECTURE WHERE teacherId = ?';
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else {
                if (rows) {
                    let today = moment().subtract(1, 'days');
                    let newRow = [];
                    for (let i = 0; i < rows.length; i++) {
                        let date = moment(rows[i]["date"], "DD/MM/YYYY")
                        if (today.isBefore(date)) {
                            newRow.push(row[i])
                        }
                    }
                    resolve(newRow);
                }
                else {
                    resolve(undefined);
                }
            }
        });
    });
}

exports.increaseBookedSeats = function (lectureId) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE LECTURE SET numberOfSeats = numberOfSeats + 1 WHERE lectureId = ?';
        db.run(sql, [lectureId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

exports.decreaseBookedSeats = function (lectureId) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE LECTURE SET numberOfSeats = numberOfSeats - 1 WHERE lectureId = ?';
        db.run(sql, [lectureId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

exports.getTomorrowsLecturesList = function (teacherId) {
    let tomorrow = moment().format('DD/MM/YYYY');

    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM LECTURE WHERE date = ? AND teacherId = ?";
        db.all(sql, [tomorrow, teacherId], (err, rows) => {
            if (err)
                reject(err);
            else {
                if (rows) {
                    resolve(rows);
                }
                else
                    resolve(undefined);
            }
        });
    });
}

exports.getPastLectures = function (course) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT LECTURE.date, LECTURE.startingTime, LECTURE.endingTime FROM LECTURE, COURSE WHERE LECTURE.courseId = COURSE.courseId AND COURSE.name = ? ORDER BY LECTURE.date";
        db.all(sql, [course], (err, rows) => {
            if (err)
                reject(err);
            else {
                if (rows) {
                    resolve(rows);
                }
                else
                    resolve(undefined);
            }
        })

    })
}
exports.changeLectureType = function (lectureId) {
    //console.log(lectureId);
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE LECTURE SET inPresence = "0" WHERE lectureId = ?';
        db.run(sql, [lectureId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}