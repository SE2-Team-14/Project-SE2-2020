'use strict';

const db = require('../db/db');
const Course = require('../bean/course');


function createCourse(row) {
    return new Course(row.courseId, row.teacherId, row.name);
}

exports.createCourse = function (course) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO COURSE(courseId, teacherId, name) VALUES(?, ?, ?)';
        let params = [];
        console.log("New course: ", course);
        params.push(course.courseId, course.teacherId, course.name);

        if (course)
            db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.lastID);
                }
            });
    });
}

exports.deleteCourseById = function (courseId) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM COURSE WHERE courseId = ?";
        db.all(sql, [courseId], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}

exports.getCourseByID = function (courseId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM COURSE WHERE courseId = ?";
        db.get(sql, [courseId], (err, row) => {
            if (err)
                reject(err);
            else {
                if (row) {
                    resolve(createCourse(row));
                } else
                    resolve(undefined);
            }
        });
    });
}

exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM COURSE";
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                if (rows) {

                    resolve(rows.map(row => createCourse(row)));
                }
                else
                    resolve(undefined);
            }
        });
    });
}

/** Returns an array containing the names of all courses taught by the teacher, if there are any
 * 
 * @param teacherName string containing the email of the teacher one wants to know the taught courses
 */
exports.getCoursesOfTeacher = function (teacherName) {
    return new Promise((resolve, reject) => {

        const sql = "SELECT COURSE.name FROM COURSE, PERSON WHERE COURSE.teacherId = PERSON.id AND PERSON.email = ?";
        db.all(sql, [teacherName], (err, row) => {
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
/*
exports.getTeacherSurname = function(courseId){
    return new Promise((resolve, reject) => {
        const sql = "SELECT PERSON.surname FROM PERSON P, COURSE C WHERE P.id = C.teacherId AND P.id IN (SELECT teacherId FROM COURSE WHERE courseId = ?)";
        db.all(sql, [courseId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {
                    resolve(row);
                } else {
                    resolve(undefined);
                }
            }
        })
    })
}*/
