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
    return new Course(row.courseId, row.teacherId, row.name, row.year, row.semester);
}

/**
 * Inserts a new course in the database
 * @param courses a Course array containing information about the course to be inserted (identifier, identifier of the teacher that supervises the course, name)
 */
exports.createCourse = function (courses) {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO COURSE(courseId, teacherId, name, year, semester) VALUES';

        for (let i = 0; i < courses.length - 1; i++)
            sql += '(?, ?, ?, ?, ?), ';
        sql += '(?, ?, ?, ?, ?);';

        let params = [];

        for (let i = 0; i < courses.length; i++)
            params.push(courses[i].courseId, courses[i].teacherId, courses[i].name, courses[i].year, courses[i].semester);

        db.run(sql, params, function (err) {
            if (err)
                reject(err);

            else
                resolve(this.lastID);

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

        const sql = "SELECT COURSE.name, COURSE.courseId FROM COURSE, PERSON WHERE COURSE.teacherId = PERSON.id AND PERSON.email = ?";
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

exports.getCoursesAndTeachers = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COURSE.name as courseName, PERSON.name, PERSON.surname, COURSE.courseId FROM COURSE, PERSON WHERE COURSE.teacherId = PERSON.id"
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (rows) {
                    resolve(rows);
                } else {
                    resolve(undefined);
                }
            }
        })
    })
}

exports.getCoursesByYear = function (years) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT courseId FROM COURSE WHERE ';

        for (let i = 0; i < years.length - 1; i++)
            sql += 'year = ? OR ';
        sql += 'year = ?;';

        let params = [];

        for (let i = 0; i < years.length; i++)
            params.push(years[i]);

        db.all(sql, params, (err, row) => {
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

exports.getCoursesByYearAndSemester = function (years, semester) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT courseId FROM COURSE WHERE ';

        for (let i = 0; i < years.length - 1; i++)
            sql += '(year = ? AND semester = ?) OR ';
        sql += '(year = ? AND semester = ?);';

        let params = [];

        for (let i = 0; i < years.length; i++)
            params.push(years[i], semester);

        db.all(sql, params, (err, row) => {
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