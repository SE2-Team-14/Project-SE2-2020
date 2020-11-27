'use strict';

const db = require('../db');
const CancelledBooking = require('../bean/cancelled_bookings');

function createCancelledBooking(row) {
    return new CancelledBooking(row.cancelledBookingId, row.studentId, row.lectureId, row.date);
}

exports.addCancelledBooking = function (booking) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO CANCELLED_BOOKINGS(cancelledBookingId, studentId, lectureId, date) VALUES(?, ?, ?, ?)';
        let params = [];
        console.log("Add a cancelled booking: ", booking);
        params.push(booking.cancelledBookingId, booking.studentId, booking.lectureId, booking.date);

        db.run(sql, params, function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
}

exports.deleteCancelledBooking = function (cancelledBookingId) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM CANCELLED_BOOKINGS WHERE cancelledBookingId = ?";
        db.all(sql, [cancelledBookingId], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}

exports.getCancelledBookings = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM CANCELLED_BOOKINGS";
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                if (rows) {
                    let _cancelledBooking = rows.map((row => createCancelledBooking(row)));
                    resolve(_cancelledBooking);
                } else {
                    resolve(undefined);
                }
            }
        })
    })
}

/**Returns from the database an array containing information about cancelled bookings, with each element of the array having these two fields:
    - date: string, contains the date of a lecture
    - cancellations: integer of value equal to the number of cancelled bookings for said lecture
  *@param course string containing the name of the course one wants to find statistics about
*/
exports.getCancelledBookingsStats = function (course) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) AS cancellations, CANCELLED_BOOKINGS.date FROM CANCELLED_BOOKINGS, LECTURE, COURSE WHERE CANCELLED_BOOKINGS.lectureId = LECTURE.lectureId AND COURSE.courseId = LECTURE.courseId AND COURSE.name = ? GROUP BY LECTURE.date";
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