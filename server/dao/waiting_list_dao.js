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
 * @param lessonId a string containing the id of the lesson
 */
exports.insertInWaitingList = function (studentId, lectureId) {
    return new Promise((resolve, reject) => {
        const day = moment().format('DD/MM/YYYY');
        const time = moment().format('HH:mm');
        const sql = 'INSERT INTO WAITING_LIST(studentId, lectureId, bookingDate, bookingTime) VALUES(?, ?, ?, ?)';
        let params = [];
        params.push(studentId, lectureId, day, time);
        db.run(sql, params, function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
}

exports.getFirstStudentInWaitingList = function (lectureId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT studentId FROM WAITING_LIST WHERE lectureId = ? AND bookingDate = (SELECT MIN(bookingDate) FROM WAITING_LIST WHERE lectureId = ?) AND bookingTime = (SELECT MIN(bookingTime) FROM WAITING_LIST WHERE lectureId = ?)';
        let params = [];
        params.push(lectureId, lectureId, lectureId);
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {
                    resolve(row);
                } else {
                    resolve(undefined);
                }
            }
        });
    });
}

/**
 * Deletes a registered booking in the waiting list from the table
 * @param studentId a string containing the identifier of the student that made the booking and then deleted it
 * @param lectureId an integer corresponding to the identifier of the lecture for which the student booked and then deleted a seat
 */
exports.deleteFromWaitingList = function (studentId, lectureId) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM WAITING_LIST WHERE studentId = ? AND lectureId = ?";
        db.all(sql, [studentId, lectureId], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}
