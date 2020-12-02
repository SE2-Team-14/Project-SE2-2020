'use strict';

/**
 * Contains methods that access the ENROLLMENT table in the database
 */
const db = require('../db/db');
const Enrollment = require('../bean/enrollment');
const Course = require('../dao/course_dao');
const Person = require('../dao/person_dao');

/**
 * Inserts information about a new enrollment (student and course) in the database
 * @param enrollment an Enrollment object containing information about the enrollment (course identifier, student email)
 */
exports.addEnrollment = function (enrollment) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO ENROLLMENT(courseId, email) VALUES(?, ?)';
        let params = [];
        
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

/**
 * Deletes an enrollment from the database
 * @param courseId a string containing the identifier of the course the student was enrolled in
 * @param email a string containing the email of the student that isn't enrolled anymore in the course
 */
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

