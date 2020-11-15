'use strict';

const db = require('./db');
const Enrollment = require('./enrollment');
const Course = require('./course_dao');
const Person = require('./person_dao');

exports.addEnrollment = function (enrollment) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO ENROLLMENT(courseId, email) VALUES(?, ?)';
        let params = [];
        console.log("New enrollment: ", enrollment);
        params.push(enrollment.courseId, enrollment.email);

        if (enrollment)
            db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                }
                else
                    resolve(this.lastID);
            });
    });
}

exports.deleteEnrollment = function (courseId, email) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM ENROLLMENT WHERE courseId = ? AND email = ?";
        db.all(sql, [courseId, email], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}

exports.getEnrolledStudents = function (courseId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM ENROLLMENT WHERE courseId = ?";
        db.all(sql, [courseId], (err, row) => {
            if (err)
                reject(err);
            else {
                if (row > 0) {
                    let _students = rows.map((stud => Person.createPerson(stud)))[0];
                    resolve(_students);
                }
                else
                    resolve(undefined);
            }
        });
    });
}

exports.getCourses = function (studentId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM ENROLLMENT WHERE email = ?";
        db.all(sql, [email], (err, row) => {
            if (err)
                reject(err);
            else {
                if (row > 0) {
                    let _courses = rows.map((course => Course.createCourse(course)))[0];
                    resolve(_courses);
                }
                else
                    resolve(undefined);
            }
        });
    });
}

exports.getEnrolledStudentsByCourseName = function (courseName) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM ENROLLMENT, COURSE, LECTURE WHERE ENROLLMENT.courseId = COURSE.courseId AND LECTURE.courseId = COURSE.courseId AND COURSE.name = ?";
        db.all(sql, [courseName], (err, row) => {
            if (err)
                reject(err);
            else {
                if (row.length > 0) {
                    //let _students = rows.map((row => Person.createPerson(row)))[0];
                    resolve(row);
                }
                else
                    resolve(undefined);
            }
        });
    });
}