const moment = require('moment');
const fs = require('fs');
const Papa = require('papaparse');

const Person = require('../bean/person');
const Enrollment = require('../bean/enrollment');
const Course = require('../bean/course');
const Classroom = require('../bean/classroom');
const Lecture = require('../bean/lecture');
const Schedule = require('../bean/schedule');
const PersonDao = require('../dao/person_dao');
const EnrollmentDao = require('../dao/enrollment_dao');
const CourseDao = require('../dao/course_dao');
const ClassroomDao = require('../dao/classroom_dao');
const LectureDao = require('../dao/lecture_dao');
const ScheduleDao = require('../dao/schedule_dao');

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

function loadLectures(schedule) {
    let teacher = CourseDao.getCourseByID(schedule.courseId);
    const endOfSemester = moment('2021-01-16');
    let day = associateDay(schedule.dayOfWeek.toLowerCase());
    let date = moment().day(day);
    let lectures = [];

    while (1) {
        if (date > endOfSemester)
            break;
        else {
            if (LectureDao.getSpecificLecture(schedule.courseId, teacher.teacherId, date.format('DD/MM/YYYY'), schedule.startingTime, schedule.endingTime) == undefined) {
                let lecture = new Lecture(
                    null,
                    schedule.courseId,
                    teacher.teacherId,
                    date.format('DD/MM/YYYY'),
                    schedule.startingTime,
                    schedule.endingTime,
                    1,
                    schedule.classroom,
                    0
                )
                lectures.push(lecture);
            }
        }
        date = moment(date).add(1, 'week');
    }

    let chunk = 100;
    for (let i = 0, j = lectures.length; i < j; i += chunk)
        LectureDao.addLecture(lectures.slice(i, i + chunk));

}

class DataLoader {

    async readStudentsCSV(fileData) {
        return new Promise(resolve => {
            Papa.parse(fileData, {
                header: true,
                complete: async results => {
                    let students = [];
                    for (let i = 0; i < results.data.length; i++) {
                        let dataStudent = results.data[i];

                        if (await PersonDao.getPersonByID(dataStudent.Id) == undefined) {
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
                    }
                    const chunk = 100;
                    for (let i = 0, j = students.length; i < j; i += chunk)
                        await PersonDao.createPerson(students.slice(i, i + chunk));
                    resolve(results.data);
                }
            });
        });
    }

    async readTeachersCSV(fileData) {
        return new Promise(resolve => {
            Papa.parse(fileData, {
                header: true,
                complete: async results => {
                    let teachers = [];
                    for (let i = 0; i < results.data.length; i++) {
                        let dataTeacher = results.data[i];

                        if (await PersonDao.getPersonByID(dataTeacher.Number) == undefined) {
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
                    }
                    const chunk = 100;
                    for (let i = 0, j = teachers.length; i < j; i += chunk)
                        await PersonDao.createPerson(teachers.slice(i, i + chunk));
                    resolve(results.data);
                }
            });
        });
    }

    async readEnrollmentsCSV(fileData) {
        return new Promise(resolve => {
            Papa.parse(fileData, {
                header: true,
                complete: async results => {
                    let enrollments = [];
                    for (let i = 0; i < results.data.length; i++) {
                        let dataEnrollment = results.data[i];

                        if (await EnrollmentDao.getEnrollmentById(dataEnrollment.Code, dataEnrollment.Student) == undefined) {
                            let enrollment = new Enrollment(
                                dataEnrollment.Code,
                                dataEnrollment.Student
                            );
                            enrollments.push(enrollment);
                        }
                    }
                    const chunk = 100;
                    for (let i = 0, j = enrollments.length; i < j; i += chunk)
                        await EnrollmentDao.addEnrollment(enrollments.slice(i, i + chunk));
                    resolve(results.data);
                }
            });
        });
    }

    async readCoursesCSV(fileData) {
        return new Promise(resolve => {
            Papa.parse(fileData, {
                header: true,
                complete: async results => {
                    let courses = [];
                    for (let i = 0; i < results.data.length; i++) {
                        let dataCourse = results.data[i];

                        if (await CourseDao.getCourseByID(dataCourse.Code) == undefined) {
                            let course = new Course(
                                dataCourse.Code,
                                dataCourse.Teacher,
                                dataCourse.Course,
                                dataCourse.Year,
                                dataCourse.Semester
                            );
                            courses.push(course);
                        }
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

    async readScheduleCSV(fileData) {
        return new Promise(resolve => {
            Papa.parse(fileData, {
                header: true,
                complete: async results => {
                    let schedule = [];
                    for (let i = 0; i < results.data.length; i++) {
                        let data = results.data[i];

                        let c = await ClassroomDao.getClassroom(data.Room);
                        if (c === undefined) {
                            let newClassroom = new Classroom(data.Room, data.Seats);
                            await ClassroomDao.addClassroom(newClassroom);
                        }

                        let startingTime;
                        let endingTime;

                        if (data.Time.includes('-')) {
                            let time = data.Time.toString().split('-');
                            startingTime = time[0];
                            endingTime = time[1];
                        } else {
                            let time = data.Time.toString().split(':');
                            startingTime = time[0] + ":" + time[1];
                            endingTime = time[2] + ":" + time[3];
                        }

                        let dayOfWeek = data.Day.toLowerCase();
                        let courseId = data.Code;
                        let classroom = data.Room;
                        let numberOfSeats = data.Seats;

                        let v = await ScheduleDao.getScheduleByCourseId(courseId);
                        if (v.length == 0) {
                            let s = new Schedule(
                                courseId,
                                classroom,
                                dayOfWeek,
                                numberOfSeats,
                                startingTime,
                                endingTime
                            );

                            schedule.push(s);
                            loadLectures(s);
                        }

                    }

                    let chunk = 100;
                    for (let i = 0, j = schedule.length; i < j; i += chunk)
                        await ScheduleDao.addSchedule(schedule.slice(i, i + chunk));

                    resolve(results.data);
                }
            });
        });
    }

    async modifySchedule(schedule, courseId, dayOfWeek, oldStart) {
        await loadLectures(schedule);

        await ScheduleDao.modifySchedule(schedule, courseId, dayOfWeek, oldStart);

        return (schedule)
    }

}


module.exports = DataLoader;