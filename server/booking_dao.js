'use strict';

const db = require('./db');
const Booking = require('./booking');
const moment = require("moment")

function createBooking(row) {
    return new Booking(row.studentId, row.lectureId, row.date, row.startingTime);
}

exports.addBoocking = function (booking) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO BOOKING(studentId, lectureId, date, startingTime, month, week) VALUES(?, ?, ?, ?, ?, ?)';
        let date = moment(new Date()).format("DD/MM/YYYY")
        let month = moment(new Date()).format("MMMM")
        let week = moment().startOf("isoWeek").format("DD/MM/YYYY") + "-" + moment().endOf("isoWeek").format("DD/MM/YYYY");
        let params = [];
        console.log("New booking: ", booking);
        params.push(booking.studentId, booking.lectureId, date, booking.startingTime, month, week);

        if (booking)
            db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                }
                else
                    resolve(null);
            });
    });
}

exports.deleteBooking = function (studentId, lectureId) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM BOOKING WHERE studentId = ? AND lectureId = ?";
        db.all(sql, [studentId, lectureId], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}

exports.getAllBookings = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM BOOKING";
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                if (rows)
                    resolve(rows.map((row) => createBooking(row)));
                else
                    resolve(undefined);
            }
        })
    })
}
exports.getBookings = function (studentId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM BOOKING WHERE studentId = ?";
        db.all(sql, [studentId], (err, rows) => {
            if (err)
                reject(err);
            else {
                if (rows.length > 0) {
                    let _booking = rows.map((row => createBooking(row)))[0];
                    resolve(_booking);
                }
                else
                    resolve(undefined);
            }
        });
    });
}

exports.getStatistics = function (date, mode, course) {
    return new Promise((resolve, reject) => {
        if (mode === "lecture") {
            const sql = "SELECT COUNT(*) AS bookings, BOOKING.date FROM BOOKING, LECTURE, COURSE WHERE BOOKING.lectureId = LECTURE.lectureId AND COURSE.courseId = LECTURE.courseId AND LECTURE.date = ? AND COURSE.name = ? GROUP BY BOOKING.date";
            db.all(sql, [date, course], (err, rows) => {
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
        } else if (mode === "month") {
            const sql = "SELECT COUNT(*) AS bookings, BOOKING.month FROM BOOKING, LECTURE, COURSE WHERE BOOKING.lectureId = LECTURE.lectureId AND COURSE.courseId = LECTURE.courseId AND COURSE.name = ? GROUP BY BOOKING.month";
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
        } else if (mode === "week") {
            const sql = "SELECT COUNT(*) AS bookings, BOOKING.week FROM BOOKING, LECTURE, COURSE WHERE BOOKING.lectureId = LECTURE.lectureId AND COURSE.courseId = LECTURE.courseId AND COURSE.name = ? GROUP BY BOOKING.week";
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
        } else if (mode === "total") {
            const sql = "SELECT COUNT(*) as bookings, LECTURE.date FROM BOOKING, LECTURE, COURSE WHERE BOOKING.lectureId = LECTURE.lectureId AND COURSE.courseId = LECTURE.courseId AND COURSE.name = ? GROUP BY LECTURE.date";
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
        }
    })
}