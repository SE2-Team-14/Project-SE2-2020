'use strict';

/**
 * Contains methods that access the LECTURE table in the database
 */
const db = require('../db/db');
const Lecture = require('../bean/lecture');
const moment = require('moment');

/**
 * Creates, from the result of a query performed on the database, a new Lecture object
 * 
 * @param row an Object corresponding to one tuple obtained from a query on the LECTURE table
 */
function createLecture(row) {
    return new Lecture(row.lectureId, row.courseId, row.teacherId, row.date, row.startingTime, row.endingTime, row.inPresence, row.classroomId, row.numberOfSeats);
}

/**
 * Inserts a new lecture in the database
 * @param lecture a Lecture object containing information about the new lecture(identifier, course and teacher identifier, date of the lecture, starting and ending time, whether the lesson is in presence or not, classroom identifier, number of seats already booked)
 */
exports.addLecture = function (lectures) {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO LECTURE(lectureId, courseId, teacherId, date, startingTime, endingTime, inPresence, classroomId, numberOfSeats) VALUES';

        for (let i = 0; i < lectures.length - 1; i++)
            sql += '(?, ?, ?, ?, ?, ?, ?, ?, ?), ';
        sql += '(?, ?, ?, ?, ?, ?, ?, ?, ?);';

        let params = [];

        for (let i = 0; i < lectures.length; i++)
            params.push(lectures[i].lectureId, lectures[i].courseId, lectures[i].teacherId, lectures[i].date, lectures[i].startingTime, lectures[i].endingTime, lectures[i].inPresence, lectures[i].classroomId, lectures[i].numberOfSeats);

        db.run(sql, params, function (err) {
            if (err)
                reject(err);
            else {
                resolve(this.lastID);
            }
        });
    });
}

/**
 * Deletes a lecture from the database
 * @param lectureId an integer corresponding to the identifier of the lecture to be deleted
 */
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

/**
 * Returns a Lecture object
 * @param lectureId an integer corresponding to the identifier of the lecture to be retrieved
 */
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

/**
 * Returns an array of Lecture objects, each object being a future lecture taking place in the specified day
 * @param courseId a string containing the identifier of the course to be retrieved
 * @param dayOfWeek a string containing the day where future lectures to get will take place
 */
exports.getLectureByCourseId = function (courseId, dayOfWeek) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM LECTURE WHERE courseId = ?";
        db.all(sql, [courseId], (err, rows) => {
            if (err)
                reject(err);
            else {
                if (rows) {
                    let lectures = [];
                    let res = [];
                    rows.map((row) => lectures.push(createLecture(row)));
                    for (let l of lectures) {
                        if (moment(l.date, "DD/MM/YYYY").format('ddd').toLowerCase() == dayOfWeek && moment(l.date, "DD/MM/YYYY").isAfter(moment())) {
                            res.push(l);
                        }
                    }
                    resolve(res)
                } else
                    resolve(undefined);
            }
        });
    });
}

exports.getAllLecturesList = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM LECTURE";
        db.all(sql, (err, rows) => {
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
                    newRow.sort((a, b) => {
                        if (moment(a.date + ":" + a.startingTime, "DD/MM/YYYY:HH:mm").isAfter(moment(b.date + ":" + b.startingTime, "DD/MM/YYYY:HH:mm")))
                            return 1;
                        else
                            return -1;
                    });
                    resolve(newRow);
                }
                else
                    resolve(undefined);
            }
        })
    })
}


/**
 * Returns an array containing all in presence lectures of a student. Only the lectures that are in the future (from the current day included onwards) are kept and returned to the calling function.
 * @param email a string containing the email of the student whose future in presence lectures are to be retrieved
 */
exports.getLecturesList = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM LECTURE WHERE inPresence = 1 AND courseId IN (SELECT courseId FROM ENROLLMENT WHERE id = ?)";
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
                            newRow.push(rows[i])
                        }
                    }
                    newRow.sort((a, b) => {
                        if (moment(a.date + ":" + a.startingTime, "DD/MM/YYYY:HH:mm").isAfter(moment(b.date + ":" + b.startingTime, "DD/MM/YYYY:HH:mm")))
                            return 1;
                        else
                            return -1;
                    });
                    resolve(newRow);
                }
                else
                    resolve(undefined);
            }
        });
    });
}

/**
 * Returns an array containing all in presence lectures of a student. Only the lectures that are in the future (from the current day included onwards) are kept and returned to the calling function.
 * @param email a string containing the email of the student whose future in presence lectures are to be retrieved
 */
exports.getWeekLecturesList = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM LECTURE WHERE courseId IN (SELECT courseId FROM ENROLLMENT WHERE id = ?)";
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else {
                if (rows) {
                    let lsunday = moment().subtract(1, 'weeks').endOf('isoWeek')
                    let tsunday = moment().endOf('isoWeek')
                    let newRow = [];
                    for (let i = 0; i < rows.length; i++) {
                        let date = moment(rows[i]["date"], "DD/MM/YYYY")
                        if ((lsunday.isBefore(date) && (tsunday.isAfter(date)))) {
                            newRow.push(rows[i])
                        }
                    }
                    newRow.sort((a, b) => {
                        if (moment(a.date + ":" + a.startingTime, "DD/MM/YYYY:HH:mm").isAfter(moment(b.date + ":" + b.startingTime, "DD/MM/YYYY:HH:mm")))
                            return 1;
                        else
                            return -1;
                    });
                    resolve(newRow);
                }
                else
                    resolve(undefined);
            }
        });
    });
}

/**
 * Returns an array containing all future lectures of a teacher
 * @param id a string containing the identifier of the teacher whose future lectures are to be retrieved
 */
exports.getWeekTeacherLectureList = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM LECTURE WHERE teacherId = ? ORDER BY date, startingTime';
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else {
                if (rows) {
                    let lsunday = moment().subtract(1, 'weeks').endOf('isoWeek')
                    let tsunday = moment().endOf('isoWeek')
                    let newRow = [];
                    for (let i = 0; i < rows.length; i++) {
                        let date = moment(rows[i]["date"], "DD/MM/YYYY")
                        if ((lsunday.isBefore(date) && (tsunday.isAfter(date)))) {
                            newRow.push(rows[i])
                        }
                    }
                    newRow.sort((a, b) => {
                        if (moment(a.date + ":" + a.startingTime, "DD/MM/YYYY:HH:mm").isAfter(moment(b.date + ":" + b.startingTime, "DD/MM/YYYY:HH:mm")))
                            return 1;
                        else
                            return -1;
                    });
                    resolve(newRow);
                }
                else
                    resolve(undefined);
            }
        });
    });
}

/**
 * Returns an array containing all future lectures of a teacher
 * @param id a string containing the identifier of the teacher whose future lectures are to be retrieved
 */
exports.getTeacherLectureList = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM LECTURE WHERE teacherId = ? ORDER BY date, startingTime';
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
                            newRow.push(rows[i])
                        }
                    }
                    newRow.sort((a, b) => {
                        if (moment(a.date + ":" + a.startingTime, "DD/MM/YYYY:HH:mm").isAfter(moment(b.date + ":" + b.startingTime, "DD/MM/YYYY:HH:mm")))
                            return 1;
                        else
                            return -1;
                    });
                    resolve(newRow);
                }
                else {
                    resolve(undefined);
                }
            }
        });
    });
}



/**
 * Updates information about a lecture (number of booked seats, whether the lecture is in presence or not)
 * @param lecture a Lecture object containing information about the lecture to be updated (identifier, new amount of booked seats, changes to the in presence status)
 */
// TODO: need to increase the number of updatable fields 
exports.updateLecture = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE LECTURE SET numberOfSeats = ?, inPresence = ? WHERE lectureId = ?';
        db.run(sql, [lecture.numberOfSeats, lecture.inPresence, lecture.lectureId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}

/*exports.modifyLecture = function (lecture) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE LECTURE SET startingTime = ?, endingTime = ?, classroomId = ?, numberOfSeats = ? WHERE lectureId = ?';
        db.run(sql, [lecture.startingTime, lecture.endingTime, lecture.classroomId, lecture.numberOfSeats, lecture.lectureId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}*/

/**
 * Returns an array containing all lectures of a teacher that will take place in the following day. The function is called at midnight to the send in an email the retrieved information about the incoming day.
 * @param teacherId a string containing the identifier of the teacher whose future lectures are to be retrieved
 */
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

/**
 * Returns an array of all lectures of a course, ordered by the date in which the lecture took place
 * @param course a string containing the name of the courses whose lectures are to be retrieved
 */
exports.getPastLectures = function (course, teacher, role, name, surname) {
    return new Promise((resolve, reject) => {
        if (role === "Teacher") {
            const sql = "SELECT LECTURE.date, LECTURE.startingTime, LECTURE.endingTime FROM LECTURE, COURSE, PERSON WHERE LECTURE.courseId = COURSE.courseId AND COURSE.teacherId = PERSON.id AND COURSE.name = ? AND PERSON.email = ? ORDER BY LECTURE.date";
            db.all(sql, [course, teacher], (err, rows) => {
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
        } else if (role === "Manager") {
            const sql = "SELECT LECTURE.date, LECTURE.startingTime, LECTURE.endingTime FROM LECTURE, COURSE, PERSON WHERE LECTURE.courseId = COURSE.courseId AND COURSE.teacherId = PERSON.id AND COURSE.name = ? AND PERSON.name = ? AND PERSON.surname = ? ORDER BY LECTURE.date";
            db.all(sql, [course, name, surname], (err, rows) => {
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

exports.getSpecificLecture = function (courseId, teacherId, date, startingTime, endingTime) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM LECTURE WHERE courseId = ? AND teacherId = ? AND date = ? AND startingTime = ? AND endingTime = ?";
        db.get(sql, [courseId, teacherId, date, startingTime, endingTime], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {
                    resolve(createLecture(row));
                } else {
                    resolve(undefined);
                }
            }
        });
    })
}

exports.getCurrentLecture = function (teacherId) {
    return new Promise((resolve, reject) => {
        let today = moment().format("DD/MM/YYYY");
        let hour = moment().format("HH:mm");

        const sql = "SELECT * FROM LECTURE WHERE teacherId = ? AND date = ? AND startingTime < ?";
        db.all(sql, [teacherId, today, hour], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                if (rows) {
                    resolve(rows.map((row) => createLecture(row)))
                }
                else {
                    resolve(0)
                }
            }
        })
    })
}

/**
 * Modify lectures
 * @param courses is an array containind the courseId for all courses to be switched in online mode
 */
exports.modifyLectures = function (courses) {
    let today = moment().add("1", "day").format("DD/MM/YYYY");
    let sql = 'UPDATE LECTURE SET inPresence = 0 WHERE date > ? AND ';

    for (let i = 0; i < courses.length - 1; i++)
        sql += 'courseId = ? OR ';
    sql += 'courseId = ?';

    let params = [today];    
    for (let i = 0; i < courses.length; i++)
        params.push(courses[i].courseId);

    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err)
                reject(err);
            else {
                resolve(this.lastID);
            }
        });
    });
}

exports.getLecturesToModify = function (startingDate, endingDate) {
    let sql = 'SELECT lectureId FROM LECTURE WHERE inPresence = 1 AND date >= ? AND date <= ?';
    let params = [startingDate, endingDate];    
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
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

exports.modifyLecturesByDate = function (startingDate, endingDate) {
    let sql = 'UPDATE LECTURE SET inPresence = 0 WHERE date >= ? AND date <= ?';
    let params = [startingDate, endingDate];    
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err)
                reject(err);
            else {
                resolve(this.lastID);
            }
        });
    });
}