'use strict';

/**
 * Contains methods that access the COURSE table in the database
 */
const db = require('../db/db');
const Course = require('../bean/course');

/**
 * Creates, from the result of a query performed on the database, a new Course object
 * 
 * @param row an Object corresponding to one tuple obtained from a query on the Course table
 */
function createCourse(row) {
    return new Course(row.courseId, row.teacherId, row.name);
}

/**
 * Inserts a new course in the database
 * @param course a Course object containing information about the course to be inserted (identifier, identifier of the teacher that supervises the course, name)
 */
exports.createCourse = function (course) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO COURSE(courseId, teacherId, name) VALUES(?, ?, ?)';
        let params = [];
        //console.log("New course: ", course);
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

/**
 * Deletes a course from the database
 * @param courseId a string containing the identifier of the course to be deleted
 */
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

/**
 * Returns a Course object
 * @param courseId a string containing the identifier of the course to be retrieved
 */
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

/**
 * Returns all courses present in the database, with no particular filtering
 */
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
