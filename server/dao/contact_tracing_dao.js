'use strict';

/**
 * Contains methods that access the PERSON table in the database
 */
const db = require('../db/db');
const Person = require('../bean/person');
const moment = require("moment");

/**
 * Creates, from the result of a query performed on the database, a new Person object
 * 
 * @param row an Object corresponding to one tuple obtained from a query on the PERSON table
 */
function createString(row) {
    return "" + row.id + ", " + row.name + ", "+ row.surname + ", " + row.email;
}


/* ORIGINAL QUERY:
SELECT DISTINCT p.id, p.name, p.surname, p.email
FROM PERSON  p, BOOKING  b, LECTURE  l
WHERE p.id = b.studentId and b.lectureId = l.lectureId and 
	  l.lectureId IN (
		SELECT l1.lectureId 
		FROM LECTURE l1, BOOKING b1 
		WHERE l1.lectureId = b1.lectureId and b.studentId <> '900000' and b1.studentId = '900000' and
			substr(l1.date, 7) || substr(l1.date, 4, 2) || substr(l1.date, 1, 2) 
			between '20201202' and '20201214'
		); 
 */

/**
 * Returns a list of strings containing information about contact tracing
 * @param studentId a string containing the identifier of the person whose information is to be retrieved
 */

exports.getContactTracingByStudent = function (studentId) {
    let today = moment().format("YYYYMMDD");
    let minDate = moment().subtract(14, 'days').format("YYYYMMDD");
    
    return new Promise((resolve, reject) => {

        const sql = ` 
        SELECT DISTINCT p.id, p.name, p.surname, p.email
        FROM PERSON  p, BOOKING  b, LECTURE  l
        WHERE p.id = b.studentId and b.lectureId = l.lectureId and 
              l.lectureId IN (
                SELECT l1.lectureId 
                FROM LECTURE l1, BOOKING b1 
                WHERE l1.lectureId = b1.lectureId and b.studentId <> ? and b1.studentId = ? and
                    substr(l1.date, 7) || substr(l1.date, 4, 2) || substr(l1.date, 1, 2) 
                    between ? and ?
                )`;
                
        db.all(sql, [studentId, studentId, minDate, today], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (rows) {
                    resolve(rows.map((row)=> createString(row)));
                } else {
                    resolve(undefined);
                }
            }
        });
    });
}