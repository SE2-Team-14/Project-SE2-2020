'use strict';

const db = require('./db');
const Enrollment = require('./enrollment');
const Course = require('./course_dao');
const Person = require('./person_dao');

exports.addEnrollment = function(enrollment) {
	return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO ENROLLMENT(courseId, studentId) VALUES(?, ?)';
        let params = [];
        console.log("New enrollment: ", enrollment);
        params.push(enrollment.courseId, enrollment.studentId);

        if (enrollment) 
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                }
                else 
                    resolve(this.lastID);
        });
    });
}

exports.deleteEnrollment = function(courseId, studentId){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM ENROLLMENT WHERE courseId = ? AND studentId = ?";
        db.all(sql, [courseId, studentId], (err, row) => {
            if(err)
                reject(err);
            else
               resolve(row);
        });
    });
}

exports.getEnrolledStudents = function(courseId){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM ENROLLMENT WHERE courseId = ?";
        db.all(sql, [courseId], (err, row) => {
            if(err)
                reject(err);
            else{
                if(row>0){
                    let _students = rows.map((row => Person.createPerson(row)))[0];
                    resolve(_students);
                }
                else 
                    resolve(undefined);
            }
        });
    });
}

exports.getCourses = function(studentId){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM ENROLLMENT WHERE studentId = ?";
        db.all(sql, [studentId], (err, row) => {
            if(err)
                reject(err);
            else{
                if(row>0){
                    let _courses = rows.map((row => Course.createCourse(row)))[0];
                    resolve(_courses);
                }
                else 
                    resolve(undefined);
            }
        });
    });
}