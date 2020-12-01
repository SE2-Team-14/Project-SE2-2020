'use strict';

/**
 * Contains methods that access the CANCELLED_BOOKINGS table in the database
 */
const db = require('../db/db');
const CancelledBooking = require('../bean/cancelled_bookings');

/**
 * Creates, from the result of a query performed on the database, a new CancelledBookings object
 * 
 * @param row an Object corresponding to one tuple obtained from a query on the CANCELLED_BOOKINGS table
 */
function createCancelledBooking(row) {
    return new CancelledBooking(row.cancelledBookingId, row.studentId, row.lectureId, row.date);
}

/**
 * Inserts in the database a new cancelled booking
 * @param cancelledBooking a CancelledBookings object, containing information about the student that made the booking, the lecture and the date in which it takes place
 */
exports.addCancelledBooking = function (cancelledBooking) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO CANCELLED_BOOKINGS (studentId, lectureId, date) VALUES( ?, ?, ?)';
        let params = [];
        //console.log("Add a cancelled lecture: ", lecture);
        params.push(cancelledBooking.studentId, cancelledBooking.lectureId, cancelledBooking.date);
        db.run(sql, params, function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
}

/**
 * Deletes a cancelled booking from the database
 * @param cancelledBookingId an integer corresponding to the identifier of the cancelled booking to be deleted
 */
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

/**
 * Returns an array containing all cancelled bookings present on the database, with no particular filtering
 */
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
        const sql = "SELECT COUNT(*) AS cancellations, LECTURE.date FROM CANCELLED_BOOKINGS, LECTURE, COURSE WHERE CANCELLED_BOOKINGS.lectureId = LECTURE.lectureId AND COURSE.courseId = LECTURE.courseId AND COURSE.name = ? GROUP BY LECTURE.date";
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