'use strict';

/**
 * Contains methods that access the BOOKING table inside the database, using Booking objects to return retrieved values
 */
const db = require('../db/db');
const Booking = require('../bean/booking');
const moment = require("moment")

/**
 * Creates, from the result of a query performed on the database, a new Booking object
 * @param row an Object corresponding to one tuple obtained from a query on the BOOKING table
 */
function createBooking(row) {
    return new Booking(row.studentId, row.lectureId, row.date, row.startingTime, row.present);
}

/** Saves the booking made by a student for a given lecture. Calculates the date in which the booking is made and saves it in the database with the received information, together with also the month in which the booking is made and the week, expressed as an interval of two dates with format DD/MM/YYYY, Monday to Sunday 
 * 
 * @param booking Booking object to be saved in the database, contains the ID of the student that made the booking, the ID of the lecture associated with the booking, the starting time of the lecture
 */
exports.addBoocking = function (booking) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO BOOKING(studentId, lectureId, date, startingTime, month, week, present) VALUES(?, ?, ?, ?, ?, ?, ?)';
        let date = moment(new Date()).format("DD/MM/YYYY")
        let month = moment(new Date()).format("MMMM")
        let week = moment().startOf("isoWeek").format("DD/MM/YYYY") + "-" + moment().endOf("isoWeek").format("DD/MM/YYYY");
        let params = [];
        params.push(booking.studentId, booking.lectureId, date, booking.startingTime, month, week, booking.present ? booking.present : 0);

        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            }
            else
                resolve(null);
        });
    });
}
/**
 * Deletes a registered booking from the table
 * @param studentId a string containing the identifier of the student that made the booking and then deleted it
 * @param lectureId an integer corresponding to the identifier of the lecture for which the student booked and then deleted a seat
 */
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

/**
 * Returns an array containing all bookings present in the database, with no further filtering
 */
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

/**
 * Returns an array containing all bookings made by a student (both past and future bookings are retrieved)
 * @param studentId a string containing the identifier of the student whose bookings are to be taken
 */
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
/**
 * Deletes a booking after a teacher deletes a lecture or switches it from in presence to virtual. Removes all bookings from the lecture altogether
 * @param lectureId an integer corresponding to the identifier of the lecture that was deleted/changed by the teacher
 */
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
/**
 * Returns, after a teacher deletes a lecture or changes it to be virtual, an array containing the following information:
 *  - PersonName: a string containing the name of the student booked at the lecture
 *  - Email: a string containing the email of the booked student, which will receive an email containing information about a change in lecture settings (deletion/switch to virtual from in presence)
 *  - CourseName: a string containing the name of the course that contains the lecture involved
 *  - LectureDate: a string containing the date in which the lesson was supposed to take place, in format DD/MM/YYYY
 *  - LectureStartTime: a string containing the hour at which the lesson was supposed to start, in format HH:MM
 * @param lectureId an integer corresponding to the identifier of the deleted/changed lecture
 */
exports.findEmailByLecture = function (lectureId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT p.name AS PersonName , p.email AS Email, c.name AS CourseName, l.date AS LectureDate, l.startingTime AS LectureStartTime FROM BOOKING b, PERSON p, LECTURE l, COURSE c WHERE b.studentId = p.id AND b.lectureId = l.lectureId AND l.courseId = c.courseId AND b.lectureId = ?";
        db.all(sql, [lectureId], (err, rows) => {
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
            const sql = "SELECT COUNT(*) as bookings, LECTURE.date, LECTURE.startingTime, LECTURE.endingTime FROM BOOKING, LECTURE, COURSE WHERE BOOKING.lectureId = LECTURE.lectureId AND COURSE.courseId = LECTURE.courseId AND COURSE.name = ? GROUP BY LECTURE.date";
            db.all(sql, [course], (err, rows) => {
                if (err)
                    reject(err);
                else {
                    if (rows.length > 0) {
                        let newRows = [];
                        rows.map((row) => newRows.push({ bookings: row.bookings, date: row.date + " " + row.startingTime + " - " + row.endingTime, }));
                        resolve(newRows);
                    }
                    else
                        resolve(undefined);
                }
            })
        } else if (mode === "attendance") {
            const sql = "SELECT COUNT(*) as presences, LECTURE.date FROM BOOKING, LECTURE, COURSE WHERE BOOKING.lectureId = LECTURE.lectureId AND COURSE.courseId = LECTURE.courseId AND COURSE.name = ? AND BOOKING.present = 1 GROUP BY LECTURE.date";
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
                if (row) {
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

/** Returns a list of all booked students for all future lectures of a given course, together with also information about the lectures (date, starting and ending time and classroom). The list is ordered by lecture date and also includes lectures that take place in the current day
 * 
 * @param lectureId string containing the id of the lecture 
**/
exports.getBookedStudentsByLectureId = function (lectureId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT studentId, LECTURE.date, LECTURE.startingTime, COURSE.name FROM COURSE, LECTURE, BOOKING  WHERE COURSE.courseId = LECTURE.courseId AND BOOKING.lectureId = LECTURE.lectureId AND  LECTURE.lectureId = ?";
        db.all(sql, [lectureId], (err, row) => {
            if (err)
                reject(err);
            else {
                if (row) {
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

/**
 * Returns a list of all bookings made for all separate courses of a teacher
 * @param email a string containing the email of the teacher that wants to have statistics
 */
exports.getTeacherCoursesStatistics = function (email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) AS total, COURSE.name FROM BOOKING, COURSE, LECTURE, PERSON WHERE BOOKING.lectureId = LECTURE.lectureId AND LECTURE.courseId = COURSE.courseId AND PERSON.id = COURSE.teacherId AND PERSON.email = ? GROUP BY COURSE.courseId";
        db.all(sql, [email], (err, rows) => {
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
    })
}

/**
 * Returns a list of all bookings made for all courses
 */
exports.getAllCoursesStatistics = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) AS total, COURSE.name as courseName, PERSON.name, PERSON.surname FROM BOOKING, COURSE, LECTURE, PERSON WHERE BOOKING.lectureId = LECTURE.lectureId AND LECTURE.courseId = COURSE.courseId  AND COURSE.teacherId = PERSON.id GROUP BY COURSE.courseId";
        db.all(sql, [], (err, rows) => {
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
    })
}

exports.getBookingsOfLecture = function (lectureId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM BOOKING WHERE lectureId = ?";
        db.all(sql, [lectureId], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                if (rows) {
                    resolve(rows)
                } else {
                    resolve(undefined)
                }
            }
        })
    })
}

/**
 * Updates information about a booking to record the presence of the student that made it at the lecture
 * @param booking a Booking object containing information about a booking made by a student for a lecture in which the student has been recorded as present
 */
exports.recordAttendance = function (booking) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE BOOKING SET present = ? WHERE studentId = ? AND lectureId = ?";
        db.run(sql, [booking.present, booking.studentId, booking.lectureId], function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(null)
            }
        })
    })
}

exports.getTeacherTotalAttendance = function (email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) AS presences, COURSE.name FROM BOOKING, COURSE, LECTURE, PERSON WHERE BOOKING.lectureId = LECTURE.lectureId AND LECTURE.courseId = COURSE.courseId AND PERSON.id = COURSE.teacherId AND PERSON.email = ? AND BOOKING.present = 1 GROUP BY COURSE.courseId";
        db.all(sql, [email], (err, rows) => {
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

exports.getTotalAttendance = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) AS presences, COURSE.name as courseName, PERSON.name, PERSON.surname FROM BOOKING, COURSE, LECTURE, PERSON WHERE BOOKING.lectureId = LECTURE.lectureId AND LECTURE.courseId = COURSE.courseId  AND COURSE.teacherId = PERSON.id AND BOOKING.present = 1 GROUP BY COURSE.courseId";
        db.all(sql, [], (err, rows) => {
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

exports.getFutureBookingsOfDay = function (dayOfWeek, courseId, startingTime) {
    return new Promise((resolve, reject) => {
        let today = moment();
        let res = [];
        const sql = "SELECT BOOKING.studentId, lecture.date as lectureDate, lecture.startingTime AS start, COURSE.name, lecture.classroomId FROM BOOKING, LECTURE, COURSE WHERE LECTURE.lectureId = BOOKING.lectureId AND COURSE.courseId = LECTURE.courseId AND LECTURE.courseId = ? AND LECTURE.startingTime = ?";
        db.all(sql, [courseId, startingTime], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                if (rows) {
                    for (let row of rows) {
                        if (moment(row.lectureDate, "DD/MM/YYYY").isAfter(today) && moment(row.lectureDate, "DD/MM/YYYY").format("ddd").toLowerCase() === dayOfWeek) {
                            res.push(row)
                        }
                    }
                    resolve(res)
                } else {
                    resolve(undefined)
                }
            }
        })
    })
}