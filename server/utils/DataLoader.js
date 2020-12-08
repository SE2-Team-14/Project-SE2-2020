const moment = require('moment');
const fs = require('fs');
const Papa = require('papaparse');

const Person = require('../bean/person');
const Enrollment = require('../bean/enrollment');
const Course = require('../bean/course');
const Classroom = require('../bean/classroom');
const Lecture = require('../bean/lecture');
const PersonDao = require('../dao/person_dao');
const EnrollmentDao = require('../dao/enrollment_dao');
const CourseDao = require('../dao/course_dao');
const ClassroomDao = require('../dao/classroom_dao');
const LectureDao = require('../dao/lecture_dao');

function associateDay(weekday) {
    switch (weekday) {
        case 'mon':
            return 1;
        case 'tue':
            return 2;
        case 'wed':
            return 3;
        case 'thu':
            return 4;
        case 'fri':
            return 5;
    }
}

class DataLoader {

    async readStudentsCSV(filePath) {
        const csvFile = fs.readFileSync(filePath)
        const csvData = csvFile.toString()
        return new Promise(resolve => {
            Papa.parse(csvData, {
                header: true,
                complete: async results => {
                    let students = [];
                    for (let i = 0; i < results.data.length; i++) {
                        let dataStudent = results.data[i];
                        let student = new Person(
                            dataStudent.Id,
                            dataStudent.Name,
                            dataStudent.Surname,
                            "Student",
                            dataStudent.OfficialEmail,
                            "team14",
                            dataStudent.City,
                            moment(dataStudent.Birthday).format('DD/MM/YYYY'),
                            dataStudent.SSN
                        );
                        students.push(student);
                    }
                    const chunk = 100;
                    for (let i = 0, j = students.length; i < j; i += chunk)
                        await PersonDao.createPerson(students.slice(i, i + chunk));
                    console.log('Complete', results.data.length, 'records.');
                    resolve(results.data);
                }
            });
        });
    }

    async readTeachersCSV(filePath) {
        const csvFile = fs.readFileSync(filePath)
        const csvData = csvFile.toString()
        return new Promise(resolve => {
            Papa.parse(csvData, {
                header: true,
                complete: async results => {
                    let teachers = [];
                    for (let i = 0; i < results.data.length; i++) {
                        let dataTeacher = results.data[i];
                        let teacher = new Person(
                            dataTeacher.Number,
                            dataTeacher.GivenName,
                            dataTeacher.Surname,
                            "Teacher",
                            dataTeacher.OfficialEmail,
                            "team14",
                            null,
                            null,
                            dataTeacher.SSN
                        );
                        teachers.push(teacher);
                    }
                    const chunk = 100;
                    for (let i = 0, j = teachers.length; i < j; i += chunk)
                        await PersonDao.createPerson(teachers.slice(i, i + chunk));
                    console.log('Complete', results.data.length, 'records.');
                    resolve(results.data);
                }
            });
        });
    }

    async readEnrollmentsCSV(filePath) {
        const csvFile = fs.readFileSync(filePath)
        const csvData = csvFile.toString()
        return new Promise(resolve => {
            Papa.parse(csvData, {
                header: true,
                complete: async results => {
                    let enrollments = [];
                    for (let i = 0; i < results.data.length; i++) {
                        let dataEnrollment = results.data[i];
                        let enrollment = new Enrollment(
                            dataEnrollment.Code,
                            dataEnrollment.Student
                        );
                        enrollments.push(enrollment);
                    }
                    const chunk = 100;
                    for (let i = 0, j = enrollments.length; i < j; i += chunk)
                        await EnrollmentDao.addEnrollment(enrollments.slice(i, i + chunk));
                    console.log('Complete', results.data.length, 'records.');
                    resolve(results.data);
                }
            });
        });
    }

    async readCoursesCSV(filePath) {
        const csvFile = fs.readFileSync(filePath)
        const csvData = csvFile.toString()
        return new Promise(resolve => {
            Papa.parse(csvData, {
                header: true,
                complete: async results => {
                    let courses = [];
                    for (let i = 0; i < results.data.length; i++) {
                        let dataCourse = results.data[i];
                        let course = new Course(
                            dataCourse.Code,
                            dataCourse.Teacher,
                            dataCourse.Course,
                            dataCourse.Year,
                            dataCourse.Semester
                        );
                        courses.push(course);
                    }
                    const chunk = 100;
                    for (let i = 0, j = courses.length; i < j; i += chunk)
                        await CourseDao.createCourse(courses.slice(i, i + chunk));
                    console.log('Complete', results.data.length, 'records.');
                    resolve(results.data);
                }
            });
        });
    }

    async readScheduleCSV(filePath) {
        const csvFile = fs.readFileSync(filePath)
        const csvData = csvFile.toString()
        return new Promise(resolve => {
            Papa.parse(csvData, {
                header: true,
                complete: async results => {
                    let lectures = [];
                    for (let i = 0; i < results.data.length; i++) {
                        let data = results.data[i];

                        let c = await ClassroomDao.getClassroom(data.Room);
                        if (c === undefined) {
                            let classroom = new Classroom(data.Room, data.Seats);
                            await ClassroomDao.addClassroom(classroom);
                        }

                        let time = data.Time.toString().split('-');
                        let startingTime = time[0];
                        let endingTime = time[1];

                        let day = associateDay(data.Day.toLowerCase());
                        const endOfSemester = moment('2021-01-16');
                        let date = moment().day(day);

                        let teacher = await CourseDao.getCourseByID(data.Code);

                        while (1) {
                            if (date > endOfSemester)
                                break;
                            else {
                                let lecture = new Lecture(
                                    null,
                                    data.Code,
                                    teacher.teacherId,
                                    date.format('DD/MM/YYYY'),
                                    startingTime,
                                    endingTime,
                                    1,
                                    data.Room,
                                    0
                                )
                                lectures.push(lecture);
                            }
                            date = moment(date).add(1, 'week');
                        }
                    }

                    let chunk = 100;
                    for (let i = 0, j = lectures.length; i < j; i += chunk)
                        await LectureDao.addLecture(lectures.slice(i, i + chunk));

                    console.log('Complete', results.data.length, 'records.');
                    resolve(results.data);
                }
            });
        });
    }

}

module.exports = DataLoader;