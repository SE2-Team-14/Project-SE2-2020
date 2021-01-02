'use strict';

const db = require('../db/db');
const Schedule = require('../bean/schedule');

function createSchedule(row) {
    return new Schedule(row.courseId, row.classroom, row.dayOfWeek, row.numberOfSeats, row.startingTime, row.endingTime);
}

exports.addSchedule = function (schedule) {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO SCHEDULE(courseId, classroom, dayOfWeek, numberOfSeats, startingTime, endingTime) VALUES';

        for (let i = 0; i < schedule.length - 1; i++)
            sql += '(?, ?, ?, ?, ?, ?), ';
        sql += '(?, ?, ?, ?, ?, ?);';

        let params = [];

        for (let i = 0; i < schedule.length; i++) {
            params.push(schedule[i].courseId, schedule[i].classroom, schedule[i].dayOfWeek, schedule[i].numberOfSeats, schedule[i].startingTime, schedule[i].endingTime);
        }

        db.run(sql, params, function (err) {
            if (err)
                reject(err);

            else
                resolve(this.lastID);
        });
    });
}

exports.getScheduleByCourseId = function (courseId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM SCHEDULE WHERE courseId = ?";
        db.get(sql, [courseId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {
                    resolve(createSchedule(row));
                } else {
                    resolve(undefined);
                }
            }
        });
    });
}
