'use strict';

const db = require('./db');
const Course = require('./course');

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
        db.all(sql, [courseId], (err, row) => {
            if (err)
                reject(err);
            else {
                if (row)
                    resolve(createCourse(row));
                else
                    resolve(undefined);
            }
        });
    });
}

exports.getCourseName = function(courseId){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM COURSE WHERE courseId = ?";
        db.all(sql, [courseId], (err, rows) => {
            if(err)
                reject(err);
            else{
                if(rows.length>0){
                    let _course = rows.map((row => createCourse(row)))[0];
                    resolve(_course);
                }
                else 
                    resolve(undefined);
            }
        });
    });
}

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
        })
    })
}

