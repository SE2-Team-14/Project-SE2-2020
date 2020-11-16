'use strict';

const db = require('./db');
const Booking = require('./booking');

function createBooking(row){
    return new Booking(row.studentId, row.lectureId, row.date, row.startingTime);
}

exports.addBoocking = function(booking) {
	return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO BOOKING(studentId, lectureId, date, startingTime) VALUES(?, ?, ?, ?)';
        let params = [];
        console.log("New booking: ", booking);
        params.push(booking.studentId, booking.lectureId, booking.date, booking.startingTime);

        if (booking) 
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                }
                else 
                    resolve(null);
        });
    });
}

exports.deleteBooking = function(studentId, lectureId){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM BOOKING WHERE studentId = ? AND lectureId = ?";
        db.all(sql, [studentId, lectureId], (err, row) => {
            if(err)
                reject(err);
            else
               resolve(row);
        });
    });
}

exports.getAllBookings = function() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM BOOKING";
        db.all(sql, [], (err, rows) => {
            if(err)
                reject(err);
            else{
                if(rows)
                    resolve(rows.map((row)=> createBooking(row)));
                else
                    resolve(undefined);
            }
        })
    })
}
exports.getBookings = function(studentId){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM BOOKING WHERE studentId = ?";
        db.all(sql, [studentId], (err, rows) => {
            if(err)
                reject(err);
            else{
                if(rows.length>0){
                    let _booking = rows.map((row => createBooking(row)))[0];
                    resolve(_booking);
                }
                else 
                    resolve(undefined);
            }
        });
    });
}