'use strict';

const db = require('./db');
const CancelledBooking = require('./cancelled_bookings');

function createCancelledBooking(row){
    return new CancelledBooking(row.cancelledBookingId, row.studentId, row.lectureId, row.date);
}

exports.addCancelledBooking = function(booking) {
	return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO CANCELLED_BOOKINGS(cancelledBookingId, studentId, lectureId, date) VALUES(?, ?, ?, ?)';
        let params = [];
        console.log("Add a cancelled booking: ", booking);
        params.push(booking.cancelledBookingId, booking.studentId, booking.lectureId, booking.date);
        
        db.run(sql, params, function(err) {
            if (err) 
                reject(err);
            else 
                resolve(this.lastID);
        });
    });
}

exports.deleteCancelledBooking = function(cancelledBookingId){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM CANCELLED_BOOKINGS WHERE cancelledBookingId = ?";
        db.all(sql, [cancelledBookingId], (err, row) => {
            if(err)
                reject(err);
            else
               resolve(row);
        });
    });
}

exports.getCancelledBookings = function() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM CANCELLED_BOOKINGS";
        db.all(sql, [], (err, rows) => {
            if(err)
                reject(err);
            else {
                if(rows){
                    let _cancelledBooking = rows.map((row => createCancelledBooking(row)));
                    resolve(_cancelledBooking);
                } else {
                    resolve(undefined);
                }
            }
        })
    })
}
