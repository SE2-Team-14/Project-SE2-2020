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
 * @param enrollment an Enrollment array containing information about the enrollment (course identifier, student id)
 */
exports.addEnrollment = function (enrollments) {
    return new Promise((resolve, reject) => {

        let sql = 'INSERT INTO ENROLLMENT(courseId, id) VALUES ';

        for(let i=0; i<enrollments.length-1; i++)
            sql += '(?, ?), ';
        sql += '(?, ?);';

        let params = [];

        for(let i=0; i<enrollments.length; i++)
            params.push(enrollments[i].courseId, enrollments[i].id);
        

        db.run(sql, params, function (err) {
            if (err) 
                reject(err);
            else
                resolve(this.lastID);
        });
    });
}

/**
 * Deletes an enrollment from the database
 * @param courseId a string containing the identifier of the course the student was enrolled in
 * @param id a string containing the id of the student that isn't enrolled anymore in the course
 */
exports.deleteEnrollment = function (courseId, id) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM ENROLLMENT WHERE courseId = ? AND id = ?";
        db.all(sql, [courseId, id], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}

