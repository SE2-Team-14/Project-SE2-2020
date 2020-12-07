const moment = require('moment');
const fs = require('fs');
const Papa = require('papaparse');

const Person = require('../bean/person');
const Enrollment = require('../bean/enrollment');
const Course = require('../bean/course');
const Classroom = require('../bean/classroom');
const PersonDao = require('../dao/person_dao');
const EnrollmentDao = require('../dao/enrollment_dao');
const CourseDao = require('../dao/course_dao');
const ClassroomDao = require('../dao/classroom_dao');

class DataLoader{

    async readStudentsCSV (filePath) {
        const csvFile = fs.readFileSync(filePath)
        const csvData = csvFile.toString()  
        return new Promise(resolve => {
            Papa.parse(csvData, {
                header: true,
                complete: async results => {
                    let students = [];
                    for(let i=0; i<results.data.length; i++){
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
                    for(let i=0, j=students.length; i<j; i+=chunk) 
                        await PersonDao.createPerson(students.slice(i, i+chunk));
                    console.log('Complete', results.data.length, 'records.'); 
                    resolve(results.data);
                }
            });
        });
    };

    async readTeachersCSV (filePath) {
        const csvFile = fs.readFileSync(filePath)
        const csvData = csvFile.toString()  
        return new Promise(resolve => {
            Papa.parse(csvData, {
                header: true,
                complete: async results => {
                    let teachers = [];
                    for(let i=0; i<results.data.length; i++){
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
                    for(let i=0, j=teachers.length; i<j; i+=chunk) 
                        await PersonDao.createPerson(teachers.slice(i, i+chunk));
                    console.log('Complete', results.data.length, 'records.'); 
                    resolve(results.data);
                }
            });
        });
    };

    async readEnrollmentsCSV (filePath) {
        const csvFile = fs.readFileSync(filePath)
        const csvData = csvFile.toString()  
        return new Promise(resolve => {
            Papa.parse(csvData, {
                header: true,
                complete: async results => {
                    let enrollments = [];
                    for(let i=0; i<results.data.length; i++){
                        let dataEnrollment = results.data[i];
                        let enrollment = new Enrollment(
                            dataEnrollment.Code,
                            dataEnrollment.Student
                        );
                        enrollments.push(enrollment);
                    }
                    const chunk = 100;
                    for(let i=0, j=enrollments.length; i<j; i+=chunk) 
                        await EnrollmentDao.addEnrollment(enrollments.slice(i, i+chunk));
                    console.log('Complete', results.data.length, 'records.'); 
                    resolve(results.data);
                }
            });
        });
    };

    async readCoursesCSV (filePath) {
        const csvFile = fs.readFileSync(filePath)
        const csvData = csvFile.toString()  
        return new Promise(resolve => {
            Papa.parse(csvData, {
                header: true,
                complete: async results => {
                    let courses = [];
                    for(let i=0; i<results.data.length; i++){
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
                    for(let i=0, j=courses.length; i<j; i+=chunk) 
                        await CourseDao.createCourse(courses.slice(i, i+chunk));
                    console.log('Complete', results.data.length, 'records.'); 
                    resolve(results.data);
                }
            });
        });
    };

    async readScheduleCSV (filePath) {
        const csvFile = fs.readFileSync(filePath)
        const csvData = csvFile.toString()  
        return new Promise(resolve => {
            Papa.parse(csvData, {
                header: true,
                complete: async results => {
                    let classrooms = [];
                    let classroom;
                    for(let i=0; i<results.data.length; i++){
                        let classroomData = results.data[i];
                        classroom = new Classroom(
                            classroomData.Room, 
                            classroomData.Seats
                        );
                        let found = false;
                        for(let i=0; i<classrooms.length; i++){
                            if(classrooms[i].classroom == classroom.classroom){
                                found = true;
                                break;
                            }
                        }
                        if(found==false)
                            classrooms.push(classroom);
                    }
                    console.log(classrooms);
                    const chunk = 10;
                    for(let i=0, j=classrooms.length; i<j; i+=chunk) 
                        await ClassroomDao.addClassroom(classrooms.slice(i, i+chunk));
                    console.log('Complete', results.data.length, 'records.'); 
                    resolve(results.data);
                }
            });
        });
    };

}

module.exports = DataLoader;