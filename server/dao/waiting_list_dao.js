'use strict';

/**
 * Contains methods that access the WAITING_LIST table in the database
 */
const db = require('../db/db');
const waiting_list = require('../bean/waiting_list');
const moment = require("moment")

/**
 * Inserts in the database a new cancelled booking
 * @param stundetId a string containing the identifier of the student
 * @param courseId a string containing the id of the course
 * @param lessonId a string containing the id of the lesson
 */
exports.insertInWaitingList = function (studentId, courseId, lectureId) {
    return new Promise((resolve, reject) => {
        const day = moment().format('DD/MM/YYYY');
        const time = moment().format('HH:mm');
        const sql = 'INSERT INTO WAITING_LIST(studentId, lectureId, courseId, bookingDate, bookingTime) VALUES(?, ?, ?, ?, ?)';
        let params = [];
        params.push(studentId, courseId, lectureId, day, time);
        db.run(sql, params, function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
}

exports.getFirstStudentInWaitingList = function (courseId, lectureId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT studentId FROM WAITING_LIST WHERE courseId = ? AND lectureId = ? AND bookingDate = (SELECT MIN(bookingDate) FROM WAITING_LIST WHERE courseId = ? AND lectureId = ?) AND bookingTime = (SELECT MIN(bookingTime) FROM WAITING_LIST WHERE courseId = ? AND lectureId = ?)';
        let params = [];
        params.push(courseId, lectureId, courseId, lectureId, courseId, lectureId);
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {
                    console.log(row)
                    resolve(row);
                } else {
                    resolve(undefined);
                }
            }
        });
    });
}