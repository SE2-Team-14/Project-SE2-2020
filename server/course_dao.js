'use strict';

const db = require('./db');
const course = require('./course');

function createCourse(row){
    return new Course(row.courseId, row.name);
}

exports.createCourse = function(course) {
	return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO COURSE(courseId, name) VALUES(?, ?)';
        let params = [];
        console.log("new Course: ", course);
        params.push(course.courseId, course.name);

        if (course) 
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.lastID);
                }
        });
    });
}

exports.deleteCourseById = function(courseId){
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM COURSE WHERE courseId = ?";
        db.all(sql, [courseId], (err, row) => {
            if(err)
                reject(err);
            else(row)
               resolve();
        });
    });
}

exports.getCourseByID = function(courseId){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM COURSE WHERE courseId = ?";
        db.all(sql, [studentId], (err, row) => {
            if(err)
                reject(err);
            else{
                if(row)
                    resolve(createCourse(row));
                else 
                    resolve(undefined);
            }
        });
    });
}
