'use strict';

const db = require('../db');
const Booking = require('../bean/booking');
const moment = require("moment")

function createBooking(row) {
    return new Booking(row.studentId, row.lectureId, row.date, row.startingTime);
}

/** Saves the booking made by a student for a given lecture. Calculates the date in which the booking is made and saves it in the database with the received information, together with also the month in which the booking is made and the week, expressed as an interval of two dates with format DD/MM/YYYY, Monday to Sunday 
 * 
 * @param booking booking object to be saved in the database, contains the ID of the student that made the booking, the ID of the lecture associated with the booking, the starting time of the lecture
 */
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
                if (rows) {
                    let _booking = rows.map((row => createBooking(row)));
                    resolve(_booking);
                }
                else
                    resolve(undefined);
            }
        });
    });
}
//DELETE the booking related to the lecture deleted or switch to virtual by the teacher
exports.deleteBookingByTeacher = function (lectureId) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM BOOKING WHERE lectureId = ?"
        db.run(sql, [lectureId], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}

/** Returns an array containing statistics about a given course, with each element having these values:
 *   - bookings: integer containing the amount of booked students associated to one of the following values, depending on the mode
 *   - date: string, present if mode === lecture. Contains the date in which bookings have been made regarding a single lecture
 *   - month: string, present only if mode === month. Contains the month in which the number of bookings has been done (sum of all bookings made in the month, counted without specifying the lecture)
 *   - week: string, present only if mode === week. Contains the week in which the number of bookings has been done, espressed as an interval of dates in format DD/MM/YYYY, Monday to Sunday (sum of all bookings made in the week, counted without specifying the lecture)
 *   - date: string, present if mode === total with a different meaning than the one above. Contains the date of a lecture and bookings contains the total amount of bookings registered for that lecture
 * @param date string containing the date of a lecture one wants to have statistics about. Is set to null value if mode is not equal to lecture (no need to have the date of a single lecture otherwise) 
 * @param mode string containing the mode one wants to have statistics about (days for a single lecture, divided by week, divided by month, total bookings divided by lecture)
 * @param course string containing the name of the course one wants to have statistics about
 */
exports.getStatistics = function (date, mode, course) {
    return new Promise((resolve, reject) => {
        if (mode === "lecture") {
            const sql = "SELECT COUNT(*) AS bookings, BOOKING.date FROM BOOKING, LECTURE, COURSE WHERE BOOKING.lectureId = LECTURE.lectureId AND COURSE.courseId = LECTURE.courseId AND LECTURE.date = ? AND COURSE.name = ? GROUP BY BOOKING.date";
            db.all(sql, [date, course], (err, rows) => {
                if (err)
                    reject(err);
                else {
                    if (rows.length > 0) {
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
                    console.log(rows)
                    if (rows.length > 0) {
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
                    if (rows.length > 0) {
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
                    if (rows.length > 0) {
                        resolve(rows);
                    }
                    else
                        resolve(undefined);
                }
            })
        }
    })
}


/** Returns a list of all booked students for all future lectures of a given course, together with also information about the lectures (date, starting and ending time and classroom). The list is ordered by lecture date and also includes lectures that take place in the current day
 * 
 * @param courseName string containing the name of the course for which a teacher wants to have a list of booked students
 */
exports.getBookedStudentsByCourseName = function (courseName) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT studentId, LECTURE.date, LECTURE.startingTime, LECTURE.endingTime, LECTURE.classroomId  FROM COURSE, LECTURE, BOOKING  WHERE COURSE.courseId = LECTURE.courseId AND  BOOKING.lectureId = LECTURE.lectureId AND  COURSE.name = ? ORDER BY LECTURE.date";
        db.all(sql, [courseName], (err, row) => {
            if (err)
                reject(err);
            else {
                if (row.length > 0) {
                    //let _students = rows.map((row => Person.createPerson(row)))[0];
                    let today = moment().subtract(1, 'days');
                    let newRow = [];
                    for (let i = 0; i < row.length; i++) {
                        let date = moment(row[i]["date"], "DD/MM/YYYY")
                        if (today.isBefore(date)) {
                            newRow.push(row[i])
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