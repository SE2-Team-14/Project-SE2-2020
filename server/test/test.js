'use strict';

const dbsettings = require('../db/dbsettings');
dbsettings.test = true;

const assert = require('assert');
const Person = require('../bean/person');
const Course = require('../bean/course');
const Lecture = require('../bean/lecture');
const Enrollment = require('../bean/enrollment');
const Classroom = require('../bean/classroom');
const Booking = require('../bean/booking');
const CancelledBooking = require('../bean/cancelled_bookings');
const CancelledLecture = require('../bean/cancelled_lectures');
const WaitingList = require('../bean/waiting_list');
const PersonDao = require('../dao/person_dao');
const CourseDao = require('../dao/course_dao');
const LectureDao = require('../dao/lecture_dao');
const EnrollmentDao = require('../dao/enrollment_dao');
const ClassroomDao = require('../dao/classroom_dao');
const BookingDao = require('../dao/booking_dao');
const CancelledBookingsDao = require('../dao/cancelled_bookings_dao');
const CancelledLecturesDao = require('../dao/cancelled_lectures_dao');
const EmailSender = require('../utils/EmailSender');
const WaitingListDao = require('../dao/waiting_list_dao');
const ContactTracingDao = require('../dao/contact_tracing_dao');
const DataLoader = require('../utils/DataLoader');

const moment = require('moment');
const chai = require('chai');
const expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
const chaiHttp = require('chai-http');
const runServer = require('../server');
const { resolve } = require('path');
var request = require("request");
const db = require('../db/db');
chai.should();
chai.use(chaiHttp);
chai.use(chaiAsPromised);


//---------------------------------------!!! IMPORTANT !!!---------------------------------------//
/**
 * For future tests that have to insert values in the tables:
 *  PERSON
 *  COURSE
 *  ENROLLMENT
 *  LECTURE
 * remember to push the created values inside an array of the needed object (Person/Course/Enrollment/Lecture) and
 * to pass that array to the function in the Dao, or the test will fail because the creation method won't work on 
 * single objects
 */

describe('Server side unit test', function () {

  /*let server;*/

  /**start the server before test */
  before(done => {
    /*server =*/runServer(done);
  });

  //----------------------------------------- API tests -----------------------------------------//

  describe('Server #GET methods tests', function () {
    //Test that http://localhost:3001/api/student-home/900000/bookable-lectures returns 200
    describe('#Test /api/student-home/:id/bookable-lectures', function () {
      var url = "http://localhost:3001/api/student-home/900000/bookable-lectures";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });
    //#1 Test that http://localhost:3001/api/student-home/student@test.it/bookable-lectures returns the right lectures
    describe('#Test /api/student-home/student@test.it/bookable-lectures', function () {
      let student = new Person("s1", "testName1", "testSurname1", "Student", "student1@test.it", "Password");
      PersonDao.createPerson(student);
      let lecture = new Lecture(1, "testCourseId1", "testTeacherId1", "testDate1", "testStartingTime1", "testEndingTime1", "1", 12, 0);
      LectureDao.addLecture(lecture);
      let enrollment = new Enrollment("testCourseId1", "student1@test.it");
      EnrollmentDao.addEnrollment(enrollment);
      var url = "http://localhost:3001/api/student-home/student1@test.it/bookable-lectures";
      it("returns lecture 1", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(lecture));
          done();
        });
      });
    });
    // #2 Test that http://localhost:3001/api/getCourses returns the right courses
    describe('#Test /api/getCourses/body', function () {
      let course = new Course("testCourseId2", "teacherTestId2", "nameTestCourse2");
      CourseDao.createCourse(course);
      var url = "http://localhost:3001/api/getCourses";
      it("returns courseTestId2", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(course));
          expect(response.statusCode).to.equal(200);
          done();
        });
      });

    });
    //Test that http://localhost:3001/api/getTeachers returns 200
    describe('#Test /api/getTeachers', function () {
      var url = "http://localhost:3001/api/getTeachers";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });
    // #3 Test that http://localhost:3001/api/getTeachers returns the right teachers
    describe('#Test /api/getTeachers/body', function () {
      let teacher = new Person("d3", "testName3", "testSurname3", "Teacher", "teacher3@test.it", "password");
      PersonDao.createPerson(teacher);
      var url = "http://localhost:3001/api/getTeachers";
      it("returns teacher d3", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(teacher));
          done();
        });
      });
    });
    //Test that http://localhost:3001/api/getClassrooms returns 200
    describe('#Test /api/getClassrooms', function () {
      var url = "http://localhost:3001/api/getClassrooms";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });
    //#4 Test that http://localhost:3001/api/getClassrooms returns the right classrooms
    describe('#Test /api/getClassrooms/body', function () {
      let classroom = new Classroom("4", 50);
      ClassroomDao.addClassroom(classroom);
      var url = "http://localhost:3001/api/getClassrooms";
      it("returns classroom 4", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(classroom));
          done();

        });
      });

    });
    //Test that http://localhost:3001/api/name returns 200
    describe('#Test /api/name', function () {
      var url = "http://localhost:3001/api/name";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });
    //Test that http://localhost:3001/api/getBookings returns 200
    describe('#Test /api/getAllBookings', function () {
      var url = "http://localhost:3001/api/getAllBookings";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });
    //#5 Test that http://localhost:3001/api/getBookings returns the right bookings
    describe('#Test /api/getAllBookings/body', function () {
      let booking = new Booking("5", 5, "date5", "startingTime5");
      BookingDao.addBoocking(booking);
      var url = "http://localhost:3001/api/getAllBookings";
      it("returns booking 5", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(booking));
          done();
        });
      });

    });
    // #6 Test that http://localhost:3001/api/getTeacherLectures returns the right lectures
    describe('#Test /api/getTeacherLectures/body', function () {
      let lecture = new Lecture(6, "c6", "d6", "6/6/6", "8:30", "10:00", 1, "6", 6);
      LectureDao.addLecture(lecture);
      var url = "http://localhost:3001/api/getTeacherLectures";
      it("returns lecture 6", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(lecture));
          done();
        });
      });
    });
    //Test that http://localhost:3001/api/getCourses returns 200
    describe("#Test /api/getCourses", function () {
      var url = "http://localhost:3001/api/courses";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        })
      })
    });
    //#7 Test that http://localhost:3001/api/getCourses returns the right courses
    describe("#Test /api/getCourses/body", function () {
      let course = new Course(7, "d7", "TestCourse7");
      CourseDao.createCourse(course);
      var url = "http://localhost:3001/api/courses";
      it("returns course 7", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(course));
          done();
        });
      });
    })
    //Test that http://localhost:3001/api/getPersonName returns 200
    describe("#Test /api/getPersonName", function () {
      var url = "http://localhost:3001/api/name";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        })
      })
    })
    //#8 Test that http://localhost:3001/api/getPersonName returns the right teacheName
    describe("#Test /api/getPersonName/body", function () {
      let person = new Person("d8", "TestName8", "TestSurname8", "Teacher8", "email8@test.com", "Testing");
      PersonDao.createPerson(person);
      var url = "http://localhost:3001/api/name";
      it("returns person 8", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(person));
          done();
        })
      })

    })

  });
  //#9
  describe('Test #POST book', function () {
    var host = "http://localhost:3001";
    var path = "/api/bookings";
    let b = new Booking("s9", 9, "18/11/2020", "8.30");

    it('should send parameters to : /api/bookings POST', function (done) {
      chai
        .request(host)
        .post(path)
        .set('content-type', 'application/json')
        .send({ booking: b, studentName: "testName9", courseName: "testCourse9", date: "18/11/2020", startingTime: "8.30", recipient: "test9@email.com" })
        .end(function (error, response, body) {
          if (error) {
            done(error);
          } else {
            expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

  });

  //#9.1
  describe('Test #DELETE book', function () {
    var host = "http://localhost:3001";
    var path = "/api/student-home/delete-book";

    it('should send a request to delete a booking: /api/student-home/delete-book DELETE', function (done) {
      chai
        .request(host)
        .del(path)
        .set('content-type', 'application/json')
        .send({ studentId: "s9", lectureId: 9 })
        .end(function (error, response, body) {
          if (error) {
            done(error);
          } else {
            expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

  });
  //#11
  describe('Test #PUT update lecture', function () {
    var host = "http://localhost:3001";
    var path = "/api/lectures";
    let lecture = new Lecture(11, "c11", "d11", "12/12/12", "8:30", "10:00", 1, "11", 11);
    it('should send parameters to : /api/lectures PUT', function (done) {
      chai
        .request(host)
        .put(path)
        .set('content-type', 'application/json')
        .send({ lecture: lecture })
        .end(function (error, response, body) {
          if (error) {
            done(error);
          } else {
            expect(response.statusCode).to.equal(200);
            done();
          }
        });
    });

    //Test that http://localhost:3001/api/bookedStudents returns 200
    describe('#Test /api/bookedStudents', function () {
      var url = "http://localhost:3001/api/bookedStudents";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    //Test that http://localhost:3001/getBookings/s90000 returns 200
    describe('#Test /api/getBookings/s90000', function () {
      var url = "http://localhost:3001/api/getBookings/s9000";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    //Test that http://localhost:3001/api/getTeacherLectures/d80000 returns 200
    describe('#Test /api/getTeacherLectures/d80000', function () {
      var url = "http://localhost:3001/api/getTeacherLectures/d80000";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });


    //Test that http://localhost:3001/api/allCoursesStats returns 200
    describe('#Test /api/allCoursesStats', function () {
      var url = "http://localhost:3001/api/allCoursesStats";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    //Test that http://localhost:3001/api/allCoursesStatistics returns 200
    describe('#Test /api/allCoursesStatistics', function () {
      var url = "http://localhost:3001/api/allCoursesStatistics";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    //Test that http://localhost:3001/api/getAllCourses returns 200
    describe('#Test /api/getAllCourses', function () {
      var url = "http://localhost:3001/api/getAllCourses";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    //Test that http://localhost:3001/api/getCoursesAndTeachers returns 200
    describe('#Test /api/getCoursesAndTeachers', function () {
      var url = "http://localhost:3001/api/getCoursesAndTeachers";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    //Test that http://localhost:3001/api/cancelledLecturesStats returns 200
    describe('#Test /api/cancelledLecturesStats', function () {
      var url = "http://localhost:3001/api/cancelledLecturesStats";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    //Test that http://localhost:3001/api/student-home/s8000/week-lectures returns 200
    describe('#Test /api/student-home/s8000/week-lectures', function () {
      var url = "http://localhost:3001/api/student-home/s8000/week-lectures";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    //Test that http://localhost:3001/api/getLectureById/12 returns 200
    describe('#Test /api/getLectureById/12', function () {
      var url = "http://localhost:3001/api/getLectureById/12";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    //Test that http://localhost:3001/api/cancelledBookings returns 200
    describe('#Test /api/cancelledBookings', function () {
      var url = "http://localhost:3001/api/cancelledBookings";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    //Test that http://localhost:3001/api/getAllWaitingList returns 200
    describe('#Test /api/getAllWaitingList', function () {
      var url = "http://localhost:3001/api/getAllWaitingList";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    //Test that http://localhost:3001/api/teacher-home/d8000/week-teacher-lectures returns 200
    describe('#Test /api/teacher-home/d8000/week-teacher-lectures', function () {
      var url = "http://localhost:3001/api/teacher-home/d8000/week-teacher-lectures";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    //Test that http://localhost:3001/api/student-home/s8000/week-lectures returns 200
    describe('#Test /api/student-home/s8000/week-lectures', function () {
      var url = "http://localhost:3001/api/student-home/s8000/week-lectures";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    describe('Test #POST cancelled-booking', function () {
      let host = "http://localhost:3001";
      let path = "/api/teacher-home/add-cancelled-booking";

      it('should send parameters to : /api/teacher-home/add-cancelled-booking POST', function (done) {
        chai
          .request(host)
          .post(path)
          .set('content-type', 'application/json')
          .send({ studentId: "s9000", lectureId: 12 })
          .end(function (error, response, body) {
            if (error) {
              done(error);
            } else {
              expect(response.statusCode).to.equal(201);
              done();
            }
          });
      });
    });

    describe('Test #POST cancelled-lecture', function () {
      let host = "http://localhost:3001";
      let path = "/api/teacher-home/add-cancelled-lecture";
      let lecture = new Lecture(12, "c8000", "d8000", "12/12/2020", "8:30", "11:00", 1, "12", 2)
      
      it('should send parameters to : /api/teacher-home/add-cancelled-lecture POST', function (done) {
        chai
          .request(host)
          .post(path)
          .set('content-type', 'application/json')
          .send({ lecture: lecture })
          .end(function (error, response, body) {
            if (error) {
              done(error);
            } else {
              expect(response.statusCode).to.equal(201);
              done();
            }
          });
      });
    });

    describe('Test #POST data-loader #1', function () {
      let host = "http://localhost:3001";
      let path = "/api/data-loader";
      
      const studentHeader = "Id,Name,Surname,City,OfficialEmail,Birthday,SSN";
      const student = studentHeader + "s8000,Francesco,Bianchi,Turin,francescobianchi@studenti.politu.it,1994-02-02,ABCDEF";
      const fileType = "student";

      it('should send parameters to : /api/data-loader POST', function (done) {
        chai
          .request(host)
          .post(path)
          .set('content-type', 'application/json')
          .send({ fileData: student, fileType: fileType })
          .end(function (error, response, body) {
            if (error) {
              done(error);
            } else {
              expect(response.statusCode).to.equal(201);
              done();
            }
          });
      });
    });

    describe('Test #POST data-loader #2', function () {
      let host = "http://localhost:3001";
      let path = "/api/data-loader";
    
      const teacherHeader = "Number,GivenName,Surname,OfficialEmail,SSN";
      const teacher = teacherHeader + "d8000,Antonio,Belli,antoniobelli@politu.it,FEDCBA";
      const fileType = "teacher";

      it('should send parameters to : /api/data-loader POST', function (done) {
        chai
          .request(host)
          .post(path)
          .set('content-type', 'application/json')
          .send({  fileData: teacher, fileType: fileType })
          .end(function (error, response, body) {
            if (error) {
              done(error);
            } else {
              expect(response.statusCode).to.equal(201);
              done();
            }
          });
      });
    });

    describe('Test #POST data-loader #3', function () {
      let host = "http://localhost:3001";
      let path = "/api/data-loader";
      
      const enrollmentHeader = "Code,Student";
      const enrollment = enrollmentHeader + "c8000,s8000";
      const fileType = "enrollment";

      it('should send parameters to : /api/data-loader POST', function (done) {
        chai
          .request(host)
          .post(path)
          .set('content-type', 'application/json')
          .send({ fileData: enrollment, fileType: fileType })
          .end(function (error, response, body) {
            if (error) {
              done(error);
            } else {
              expect(response.statusCode).to.equal(201);
              done();
            }
          });
      });
    });

    describe('Test #POST data-loader #4', function () {
      let host = "http://localhost:3001";
      let path = "/api/data-loader";

      const scheduleHeader = "Code,Room,Day,Seats,Time";
      const schedule = scheduleHeader + "c8000,12,Mon,16,10:10-11:20";
      const fileType = "schedule";

      it('should send parameters to : /api/data-loader POST', function (done) {
        chai
          .request(host)
          .post(path)
          .set('content-type', 'application/json')
          .send({ fileData: schedule, fileType: fileType })
          .end(function (error, response, body) {
            if (error) {
              done(error);
            } else {
              expect(response.statusCode).to.equal(201);
              done();
            }
          });
      });
    });

    describe('Test #POST data-loader #5', function () {
      let host = "http://localhost:3001";
      let path = "/api/data-loader";

      const coursesHeader = "Code,Year,Semester,Course,Teacher";
      const course = coursesHeader + "c8000,1,1,Algoritmi,d8000";
      const fileType = "course";

      it('should send parameters to : /api/data-loader POST', function (done) {
        chai
          .request(host)
          .post(path)
          .set('content-type', 'application/json')
          .send({ fileData: course, fileType: fileType })
          .end(function (error, response, body) {
            if (error) {
              done(error);
            } else {
              expect(response.statusCode).to.equal(201);
              done();
            }
          });
      });
    });

    describe('Test #POST put-in-queue', function () {
      let host = "http://localhost:3001";
      let path = "/api/student-home/put-in-queue";

      it('should send parameters to : put-in-queue POST', function (done) {
        chai
          .request(host)
          .post(path)
          .set('content-type', 'application/json')
          .send({ studentId: "s80000", lectureId: 12 })
          .end(function (error, response, body) {
            if (error) {
              done(error);
            } else {
              expect(response.statusCode).to.equal(200);
              done();
            }
          });
      });
    });

  });

  //----------------------------------------- DAO tests -----------------------------------------//

  describe('Test university members', function () {
    //#14
    describe('#Create a student', function () {
      it('Creates a new student', async function () {
        let testStudent = new Person('s14', 'Andrea', 'Rossi', 'student', 'andrea@rossi', '1234', "city14", "bday14", "SSN14");
        let testArray = [];
        testArray.push(testStudent);
        return await PersonDao.createPerson(testArray);
      });
    });
    //#15
    describe('#Create a teacher', function () {
      it('Creates a new teacher', async function () {
        let testTeacher = new Person('d15', 'Cataldo', 'Basile', 'teacher', 'cataldo@basile', '1234', "city15", "bday15", "SSN15");
        let testArray = [];
        testArray.push(testTeacher);
        return await PersonDao.createPerson(testArray);
      });
    });
    //#15.1
    describe('Get person name', function () {
      it('Get name', async function () {
        return await PersonDao.getPersonByID('d15').then(person => assert.strictEqual('Cataldo', person.name));
      });
    });
    //#14.1
    describe('#Delete a student', function () {
      it('Deletes a student', async function () {
        return await PersonDao.deletePersonById('s14');
      });
    });
    //#15.2
    describe('#Delete a teacher', function () {
      it('Deletes a teacher', async function () {
        return await PersonDao.deletePersonById('d15');
      });
    });

    describe("#Delete someone doesn't exist", function () {
      it('Deletes nobody', async function () {
        return await PersonDao.deletePersonById("-1");
      });
    });
    //#15.3
    describe("#GetPersonByEmail", function () {
      it("Get a person by his email", async function () {
        let person = new Person("s16", "studentName16", "studentSurname16", "Student", "student16@test.it", "1234", "Napoli", "18/11/1999", "ASDFG432");
        let arrayPerson = [];
        arrayPerson.push(person);
        await PersonDao.createPerson(arrayPerson);
        return await PersonDao.getPersonByEmail(person.email).then((p) => assert.strictEqual(p.name, "studentName16"));
      })
    })

  });

  describe('Test courses', function () {
    //#16
    describe('#Create a course', function () {
      it('Creates a new course', async function () {
        let testCourse = new Course('c16', 'd16', 'Softeng II', "year16", "semester16");
        let testArray = [];
        testArray.push(testCourse)
        return await CourseDao.createCourse(testArray);
      });
    });
    //#16.1
    describe('#Gets a course by its id', function () {
      it('Test course name', async function () {
        return await CourseDao.getCourseByID('c16').then(course => assert.strictEqual('Softeng II', course.name));
      });
    });
    //#16.2
    describe('#Delete a course', function () {
      it('Deletes a course', async function () {
        return await CourseDao.deleteCourseById('c16');
      });
    });
    //#16.3
    describe('#Get courses and teachers', function () {
      it('Get courses and teachers', async function () {
        let arrayPerson = [];
        let arrayCourse = [];
        let teacher = new Person("d16", "teacherName16", "teacherSurname16", "Teacher", "teacher16@test.it", "1234", null, null, "ADFG342");
        arrayPerson.push(teacher);
        await PersonDao.createPerson(arrayPerson);
        let testCourse = new Course('c16', 'd16', 'Softeng II', "year16", "semester16");
        arrayCourse.push(testCourse);
        await CourseDao.createCourse(arrayCourse);
        return await CourseDao.getCoursesAndTeachers().then((c) => assert.strictEqual(c[1].courseName, "Softeng II"));
      });
    });


  });

  describe('Test enrollment_dao', function () {
    //#17
    describe('#Create an enrollment', function () {
      it('Creates a new enrollment', async function () {
        let testEnrollment = new Enrollment('c17', 's17');
        let testEnrollment1 = new Enrollment("c171", 's171');
        let student = new Person("s17", "Basile", "Cataldo", "student", "basile@cataldo", "1234", "city17", "bday17", "SSN17");
        let lecture = new Lecture(17, "c17", "d17", "17/12/17", "8:00", "8:10", 1, "17", 17);
        let course = new Course("c17", "d17", "TestCourse17", "year17", "sem17");
        let course1 = new Course("c171", "d17", "testCourse17", "17", "17");
        let booking = new Booking("s17", 17, "17/12/17", "8:00");
        let arrayPerson = [];
        let arrayCourse = [];
        let arrayLecture = [];
        let arrayEnrollment = [];
        arrayPerson.push(student);
        arrayCourse.push(course);
        arrayCourse.push(course1);
        arrayLecture.push(lecture);
        arrayEnrollment.push(testEnrollment);
        arrayEnrollment.push(testEnrollment1);
        return await PersonDao.createPerson(arrayPerson)
          .then(await LectureDao.addLecture(arrayLecture))
          .then(await CourseDao.createCourse(arrayCourse))
          .then(await BookingDao.addBoocking(booking))
          .then(await EnrollmentDao.addEnrollment(arrayEnrollment));
      });
    });
    //#17.1
    describe('#Deletes an enrollment', function () {
      it('Deletes an enrollment', async function () {
        return await EnrollmentDao.deleteEnrollment('c17', 's17')
          .then(await EnrollmentDao.deleteEnrollment("c171", "s17"))
          .then(await PersonDao.deletePersonById("s17"))
          .then(await CourseDao.deleteCourseById("c17"))
          .then(await BookingDao.deleteBooking("s17", 17))
          .then(await LectureDao.deleteLecture(17));
      });
    });
    //#17.2
    describe("#Get an enrollment by id", function () {
      it('Get an enrollment by courseId and studentId', async function () {
        let arrayEnrollment = [];
        let courseId = 'c17';
        let studentId = 's17';
        let enrollment = new Enrollment("c17", 's17');
        arrayEnrollment.push(enrollment);
        await EnrollmentDao.addEnrollment(arrayEnrollment);
        return await EnrollmentDao.getEnrollmentById('c17', 's17').then((e) => {
          assert.strictEqual(e.courseId == courseId, e.id == studentId)
        });
      });
    });
  });

  describe('Test lectures', function () {
    //#18
    describe('#Gets a list of lectures', function () {
      it("Gets a list of lectures", async function () {
        let tomorrow = moment().add('1', 'day').format("DD/MM/YYYY");
        let today = moment().format("DD/MM/YYYY");
        let lecture = new Lecture(18, "testCourse18", "testTeacher18", tomorrow, "8.30", "13.00", "1", "18", 18);
        let lecture1 = new Lecture(20, "testCourse18", "testTeacher18", today, "8:30", "13:00", "1", "18", 18);
        let arrayLecture = [];
        arrayLecture.push(lecture);
        arrayLecture.push(lecture1);
        await LectureDao.addLecture(arrayLecture);
        let enrollment = new Enrollment("testCourse18", "s18");
        let arrayEnrollment = [];
        arrayEnrollment.push(enrollment);
        await EnrollmentDao.addEnrollment(arrayEnrollment);
        let student = new Person("s18", "testname18", "testsurname18", "student", "test18@testone", "1233", "city18", "bday18", "SSN18");
        let arrayPerson = [];
        arrayPerson.push(student);
        await PersonDao.createPerson(arrayPerson);
        return await LectureDao.getLecturesList("s18").then(lectures => assert.strictEqual(lectures[0].lectureId, 20));
      });
    });
    //#19
    describe('#Gets the list of lectures of the teacher', function () {
      it("Gets a lecture by teacher's id", async function () {
        let tomorrow1 = moment().add(2, "days").format("DD/MM/YYYY");
        let tomorrow = moment().add(1, "day").format("DD/MM/YYYY");
        let teacher = new Person("d19", "testTeacherName19", "testTeacherSurname19", "teacher", "teacher19@testone", "1233", "city19", "bday19", "SSN19");
        let arrayTeacher = [];
        arrayTeacher.push(teacher);
        let lecture = new Lecture(19, "testCourse19", "d19", tomorrow1, "8.30", "13.00", "1", "19", 19);
        let lecture1 = new Lecture(21, "testCourse19", "d19", tomorrow, "8:30", "11:30", "1", "19", 19);
        let arrayLecture = [];
        arrayLecture.push(lecture);
        arrayLecture.push(lecture1);
        PersonDao.createPerson(arrayTeacher);
        LectureDao.addLecture(arrayLecture);
        return await LectureDao.getTeacherLectureList("d19").then(lectures => assert.strictEqual(lectures[0].lectureId, 21))
      });
    });

    //#22
    describe('#Gets the list of tomorrow lectures', function () {
      it("Gets the list of tomorrow lectures by teacher's id", async function () {
        let tomorrow = moment().format('DD/MM/YYYY');
        let teacher = new Person("d22", "testname22", "testsurname22", "teacher", "teacher22@test", "1233", "city22", "bday22", "SSN22");
        let arrayTeacher = [];
        arrayTeacher.push(teacher);
        let lecture = new Lecture(22, "testCourseTomorrow22", "d22", tomorrow, "8.30", "13.00", "1", "22", 22);
        let arrayLecture = [];
        arrayLecture.push(lecture);
        await PersonDao.createPerson(arrayTeacher);
        await LectureDao.addLecture(arrayLecture);
        return await LectureDao.getTomorrowsLecturesList("d22")
          .then(lectures => assert.strictEqual(lectures[0].courseId, "testCourseTomorrow22"))
      });
    });

    //#24
    describe('#Gets a lecture', function () {
      it('Gets a lecture by its id', async function () {
        let tomorrow = moment().format("DD/MM/YYYY")
        let student = new Person("s24", "testname24", "testsurname24", "student", "student24@test", "1233", "city24", "bday24", "SSN24");
        let arrayStudent = [];
        arrayStudent.push(student);
        let lecture = new Lecture(24, "testCourse24", "d24", tomorrow, "8.30", "13.00", "1", "24", 24);
        let arrayLecture = [];
        arrayLecture.push(lecture);
        let enrollment = new Enrollment("testCourse24", "student24@test");
        let arrayEnrollment = [];
        arrayEnrollment.push(enrollment);
        PersonDao.createPerson(arrayStudent);
        LectureDao.addLecture(arrayLecture);
        EnrollmentDao.addEnrollment(arrayEnrollment);
        return await LectureDao.getLectureById(24).then((l => assert.strictEqual(l.courseId, "testCourse24")));
      });
    });
    //#24.1
    describe('#Deletes a lecture', function () {
      it('Deletes a lecture', async function () {
        return await LectureDao.getLecturesList("student24@test").then(lectures => LectureDao.getLectureById(lectures[0].lectureId).then((lecture => LectureDao.deleteLecture(lecture.lectureId))));
      });
    });
    //#24.2
    describe('#Deletes the enrollment', function () {
      it("Deletes the previous enrollment", async function () {
        return await EnrollmentDao.deleteEnrollment("testCourse24", "student24@test");
      });
    });
    //#24.3
    describe('#Deletes the student', function () {
      it("Deletes the previous student", async function () {
        return await PersonDao.deletePersonById("s24");
      });
    });

  });

  describe('Test classroom', function () {
    //#25
    describe('#Create a classroom', function () {
      it('Creates a new classroom', async function () {
        let testClassroom = new Classroom('25', 25);
        return await ClassroomDao.addClassroom(testClassroom);
      });
    });
    //#25
    describe('#Delete a classroom', function () {
      it('Deletes a classroom', async function () {
        return await ClassroomDao.deleteClassroom('25');
      });
    });
    //#25.1
    describe('#Get classroom', function () {
      it('Get a classroom', async function () {
        let classroom = new Classroom("25a", 25);
        await ClassroomDao.addClassroom(classroom);
        return await ClassroomDao.getClassroom("25a").then((c) => assert.strictEqual(c.maxNumberOfSeats, 25));
      });
    });
  });

  describe('Test booking_dao', function () {
    //#26
    describe('#Add a booking', function () {
      it('Creates a new booking', async function () {
        let testBooking = new Booking('s26', 26, 'today', '12.00');
        return await BookingDao.addBoocking(testBooking);
      });
    });
    //#26.1
    describe('#Delete booking', function () {
      it('Deletes a booking', async function () {
        return await BookingDao.deleteBooking('s26', 26);
      });
    });
    //#27
    describe('#Delete booking by teacher', function () {
      it('Delete a booking when a teacher delete or change a lecture', async function () {
        let testBooking = new Booking('s27', 27, 'tomorrow', '15:00');
        BookingDao.addBoocking(testBooking);
        return await BookingDao.deleteBookingByTeacher(27);
      });
    });
    //#28
    describe("#Test getBookedStudentsByCourseName", function () {
      it("Gets the list of booked students for future lectures", async function () {
        let testLecture = new Lecture(28, "c28", "testTeacher28", "28/11/2028", "12:00", "13:00", "1", "28", 28);
        let arrayLecture = [];
        arrayLecture.push(testLecture);
        LectureDao.addLecture(arrayLecture);
        let testCourse = new Course("c28", "testCourse28", "courseName28", "year28", "sem28");
        let arrayCourse = [];
        arrayCourse.push(testCourse);
        CourseDao.createCourse(arrayCourse);
        let testBooking = new Booking("s28", 28, "27/11/2020", "12:00", "November", "23/11/2020-29/11/2020");
        BookingDao.addBoocking(testBooking);
        return await BookingDao.getBookedStudentsByCourseName("courseName28").then((b) => {
          assert.strictEqual(b[0].studentId, testBooking.studentId)
        });
      })
    })

    describe("Test getStatistics", function () {
      //#29
      describe("#Test lecture mode", function () {
        it("Gets the list of bookings for the specified lecture", async function () {
          let today = moment().format("DD/MM/YYYY");
          let testLecture = new Lecture(29, "c29", "testTeacher29", "29/11/2025", "12:00", "13:00", "1", "29", 29);
          let testCourse = new Course("c29", "testCourse29", "courseName29", "year29", "sem29");
          let arrayLecture = [];
          arrayLecture.push(testLecture);
          let arrayCourse = [];
          arrayCourse.push(testCourse);
          let testBooking = new Booking("s29", 29, today, "12:00");

          await LectureDao.addLecture(arrayLecture);
          await BookingDao.addBoocking(testBooking);
          await CourseDao.createCourse(arrayCourse);
          return await BookingDao.getStatistics(testLecture.date, "lecture", testCourse.name).then((s) => {
            assert.strictEqual(s[0].date, testBooking.date);
          })
        })
      })
      //#30
      describe("#Test week mode", function () {
        it("Gets the list of bookings for the specified week", async function () {
          let testLecture = new Lecture(30, "c30", "testTeacher30", "30/11/2025", "12:00", "13:00", "1", "30", 30);
          let testCourse = new Course("c30", "testCourse30", "courseName30", "year30", "sem30");
          let testBooking = new Booking("s30", 30, "27/11/2020", "12:00");
          let arrayLecture = [];
          arrayLecture.push(testLecture);
          let arrayCourse = [];
          arrayCourse.push(testCourse);
          await LectureDao.addLecture(arrayLecture);
          await BookingDao.addBoocking(testBooking);
          await CourseDao.createCourse(arrayCourse);
          return await BookingDao.getStatistics(null, "week", testCourse.name).then((s) => {
            assert.strictEqual(s[0].bookings, 1);
          })
        })
      })
      //#31
      describe("#Test month mode", function () {
        it("Gets the list of bookings for the specified month", async function () {
          let testLecture = new Lecture(31, "c31", "testTeacher31", "01/12/2025", "12:00", "13:00", "1", "31", 31);
          let arrayLecture = [];
          arrayLecture.push(testLecture);
          await LectureDao.addLecture(arrayLecture);
          let testCourse = new Course("c31", "testCourse31", "courseName31", "year31", "sem31");
          let arrayCourse = [];
          arrayCourse.push(testCourse);
          await CourseDao.createCourse(arrayCourse);
          let testBooking = new Booking("s31", 31, "27/11/2020", "12:00");
          await BookingDao.addBoocking(testBooking);
          return await BookingDao.getStatistics(null, "month", testCourse.name).then((s) => {
            assert.strictEqual(s[0].bookings, 1);
          })
        })
      })
      //#32
      describe("#Test total mode", function () {
        it("Gets the list of all bookings of the course, divided by single lecture", async function () {
          let testLecture = new Lecture(32, "c32", "testTeacher32", "2/12/2025", "12:00", "13:00", "1", "32", 32);
          let arrayLecture = [];
          arrayLecture.push(testLecture);
          await LectureDao.addLecture(arrayLecture);
          let testCourse = new Course("c32", "testCourse", "courseName32", "year32", "sem32");
          let arrayCourse = [];
          arrayCourse.push(testCourse);
          await CourseDao.createCourse(arrayCourse);
          let testBooking = new Booking("s32", 32, "27/11/2020", "12:00");
          await BookingDao.addBoocking(testBooking);
          return await BookingDao.getStatistics(null, "total", testCourse.name).then((s) => {
            assert.strictEqual(s[0].date, testLecture.date + ' ' + testLecture.startingTime + ' - ' + testLecture.endingTime);
          })
        })
      })
      //#48, will have to be changed when we implement story about attendance and code changes
      describe("Test attendance mode", function () {
        it("Gets the list of all students that attended all lectures", async function () {
          let testLecture = new Lecture(48, "c48", "testTeacher48", "2/12/2025", "12:00", "13:00", "1", "48", 48);
          let arrayLecture = [];
          arrayLecture.push(testLecture);
          await LectureDao.addLecture(arrayLecture);
          let testCourse = new Course("c48", "testCourse", "courseName48", "year48", "sem48");
          let arrayCourse = [];
          arrayCourse.push(testCourse);
          await CourseDao.createCourse(arrayCourse);
          let testBooking = new Booking("s48", 48, "16/12/2020", "12:00");
          await BookingDao.addBoocking(testBooking);
          return await BookingDao.getStatistics(null, "attendance", testCourse.name).then((s) => {
            assert.strictEqual(s[0].date, testLecture.date);
          })
        })
      })
    });
    //#33
    describe("#Test lecture mode empty", function () {
      it("Gets an empty list of bookings for an existing lecture", async function () {
        let testLecture = new Lecture(33, "c33", "testTeacher33", "3/12/2025", "12:00", "13:00", "1", "33", 33);
        let testCourse = new Course("c33", "testCourse33", "courseName33");
        LectureDao.addLecture(testLecture);
        CourseDao.createCourse(testCourse);
        return await BookingDao.getStatistics(testLecture.date, "lecture", testCourse.name).then((s) => {
          assert.strictEqual(s, undefined);
        })
      })
    })
    //#34
    describe("#Test week mode empty", function () {
      it("Gets an empty list of bookings for the given week", async function () {
        let testLecture = new Lecture(34, "c34", "testTeacher34", "4/12/2025", "12:00", "13:00", "1", "34", 34);
        let testCourse = new Course("c34", "testCourse34", "courseName34");
        LectureDao.addLecture(testLecture);
        CourseDao.createCourse(testCourse);
        return await BookingDao.getStatistics(null, "week", testCourse.name).then((s) => {
          assert.strictEqual(s, undefined);
        })
      })
    })
    //#35
    describe("#Test month mode empty", function () {
      it("Gets an empty list of bookings for the specified month", async function () {
        let testLecture = new Lecture(35, "c35", "testTeacher35", "5/12/2025", "12:00", "13:00", "1", "35", 35);
        let testCourse = new Course("c35", "testCourse35", "courseName35");
        LectureDao.addLecture(testLecture);
        CourseDao.createCourse(testCourse);
        return await BookingDao.getStatistics(null, "month", testCourse.name).then((s) => {
          assert.strictEqual(s, undefined);
        })
      })
    })
    //#36
    describe("#Test total mode empty", function () {
      it("Gets an empty list of bookings for the specified lecture", async function () {
        let testLecture = new Lecture(36, "c36", "testTeacher36", "6/12/2025", "12:00", "13:00", "1", "36", 36);
        let testCourse = new Course("c36", "testCourse36", "courseName36", "year36", "sem36");
        let arrayLecture = [];
        arrayLecture.push(testLecture);
        await LectureDao.addLecture(arrayLecture);
        let arrayCourse = [];
        arrayCourse.push(testCourse)
        await CourseDao.createCourse(arrayCourse);
        return await BookingDao.getStatistics(null, "total", testCourse.name).then((s) => {
          assert.strictEqual(s, undefined);
        })
      })
    })
    //#49, will have to be changed when we implement the story about attendance and code changes
    describe("#Test attendance mode empty", function () {
      it("Gets an empty list of presences for the specified lecture", async function () {
        let testLecture = new Lecture(49, "c49", "testTeacher49", "20/12/2025", "12:00", "13:00", "1", "49", 49);
        let testCourse = new Course("c49", "testCourse49", "courseName49", "year49", "sem49");
        let arrayCourse = [];
        let arrayLecture = [];
        arrayLecture.push(testLecture);
        await LectureDao.addLecture(arrayLecture);
        arrayCourse.push(testCourse);
        await CourseDao.createCourse(arrayCourse);
        return await BookingDao.getStatistics(null, "attendance", testCourse.courseName).then((s) => {
          assert.strictEqual(s, undefined);
        })
      })
    })

  });

  describe('Test cancelled_bookings_dao', function () {
    //#37
    describe('#Adds a deleted booking', function () {
      it('Creates and adds a new deleted booking', async function () {
        let cancelledBooking = new CancelledBooking(37, "s37", 37, "07/12/12");
        return await CancelledBookingsDao.addCancelledBooking(cancelledBooking);
      });
    });
    //#37.1
    describe('#Delete a cancelled booking', function () {
      it('Deletes the cancelled booking added before', async function () {
        return await CancelledBookingsDao.getCancelledBookings().then(cb => CancelledBookingsDao.deleteCancelledBooking(cb[0].cancelledBookingId));
      });
    });
    //#38
    describe("#Test getCancelledBookingsStats", function () {
      it("Gets a list of deleted bookings for all lectures of a course", async function () {
        let testLecture = new Lecture(38, "c38", "testTeacher38", "08/12/2025", "12:00", "13:00", "1", "38", 38);
        let arrayLecture = [];
        arrayLecture.push(testLecture);
        let testCourse = new Course("c38", "testCourse38", "courseName38");
        let arrayCourse = [];
        arrayCourse.push(testCourse);
        let testCancBooking = new CancelledBooking(38, "s38", 38, "27/11/2020");
        await LectureDao.addLecture(arrayLecture);
        await CourseDao.createCourse(arrayCourse);
        await CancelledBookingsDao.addCancelledBooking(testCancBooking);
        return await CancelledBookingsDao.getCancelledBookingsStats(testCourse.name).then((s) => {
          assert.strictEqual(s[0].date, testLecture.date);
        })
      })
    })

  });

  describe('Test cancelled_lectures_dao', function () {
    //#39
    describe('#Adds a deleted lecture', function () {
      it('Creates and adds a new deleted lecture', async function () {
        let cancelledLecture = new CancelledLecture(39, "testCourse39", "testTeacher39", "09/12/12", "1");
        return await CancelledLecturesDao.addCancelledLecture(cancelledLecture);
      });
    });
    //#39.1
    describe('#Delete a cancelled lecture', function () {
      it('Deletes the cancelled lecture added before', async function () {
        return await CancelledLecturesDao.getCancelledLectures().then(cl => CancelledLecturesDao.deleteCancelledLecture(cl[0].cancelledLectureId));
      });
    });
    //#39.2
    describe('#Get cancelled lecture stats', function () {
      it('Get cancelled lecture stats', async function () {
        let arrayPerson = [];
        let arrayCourse = [];
        let person = new Person("d39", "teacherName39", "teacherSurname39", "Teacher", "teacher39@email.it", "1234", null, null, "ASDFR432");
        arrayPerson.push(person);
        let course = new Course("c39", "d39", "CourseName39", "39", "39");
        arrayCourse.push(course);
        let cancelledLecture = new CancelledLecture(39, "c39", "d39", "09/12/12", "1");
        await PersonDao.createPerson(arrayPerson);
        await CourseDao.createCourse(arrayCourse);
        await CancelledLecturesDao.addCancelledLecture(cancelledLecture);
        return await CancelledLecturesDao.getCancelledLecturesStats().then((cl) => assert.strictEqual(cl[0].courseName, "CourseName39"));
      });
    });
  });

  describe('Test waitinglist_dao', function () {
    //#40
    describe('#Insert In Waiting List ', function () {
      it('Insert In Waiting List ', async function () {
        return await WaitingListDao.insertInWaitingList("s40", 40);
      });
    });
    //#40.1
    describe('#Delete from waiting list', function () {
      it('Deletes from waiting list', async function () {
        return await WaitingListDao.deleteFromWaitingList('s40', 40);
      });
    });
    //#41
    describe('#Get first in waiting list ', function () {
      it('Get first in waiting list ', async function () {
        await WaitingListDao.insertInWaitingList("s41", 41);
        await WaitingListDao.insertInWaitingList("s411", 41);
        return await WaitingListDao.getFirstStudentInWaitingList(41).then((f) => assert.strictEqual(f.studentId, "s41"));
      });
    });
    //#42
    describe('#Get all the waiting list ', function () {
      it('Get all the waiting list ', async function () {
        await WaitingListDao.insertInWaitingList("s42", 42);
        await WaitingListDao.insertInWaitingList("s421", 42);
        return await WaitingListDao.getAllWaitingList().then((a) => assert.strictEqual(a.length, 5));
      });
    });
  });

  describe('Test booking_dao', function () {
    //#43
    describe('#Get bookingList of a student ', function () {
      it('Get the list of bookings of a student ', async function () {
        let booking = new Booking("s43", 43, "15/12/2020", "8:30");
        await BookingDao.addBoocking(booking);
        return await BookingDao.getBookings("s43").then((b) => assert.strictEqual(b[0].lectureId, 43));
      });
    });
    //#44
    describe('#Find Email By Lecture', function () {
      it('Find All the Emails By Lecture', async function () {
        let student = new Person("s44", "studentName44", "studentSurname44", "Student", "email44@test.it", "1234", "testCity44", "18/11/1999", "HGF1235");
        let teacher = new Person("d44", "teacherName44", "teacherSurname44", "Teacher", "teacher44@test.it", "1234", null, null, "ABCD2342");
        let arrayStudent = [];
        arrayStudent.push(student);
        arrayStudent.push(teacher);
        await PersonDao.createPerson(arrayStudent);
        let course = new Course("c44", "testTeacher44", "teacherName44", "1", "1");
        let arrayCourse = [];
        arrayCourse.push(course);
        await CourseDao.createCourse(arrayCourse);
        let lecture = new Lecture(44, "c44", "d44", "25/12/2025", "8:30", "11:30", "1", "44", 44);
        let lecture1 = new Lecture(441, "c44", "d44", "25/12/2025", "8:30", "11:30", "1", "44", 44);
        let arrayLecture = [];
        arrayLecture.push(lecture);
        arrayLecture.push(lecture1);
        await LectureDao.addLecture(arrayLecture);
        let booking = new Booking("s44", 44, "15/12/2020", "8:30");
        await BookingDao.addBoocking(booking);
        return await BookingDao.findEmailByLecture(44).then((email) => assert.strictEqual(email[0].Email, "email44@test.it"));
      });
    });
    //#45
    describe('#Get Booked Students By LectureId ', function () {
      it('Get Booked Students By LectureId ', async function () {
        let course = new Course("c45", "testTeacher45", "courseName45", "1", "1");
        let arrayCourse = [];
        arrayCourse.push(course);
        await CourseDao.createCourse(arrayCourse);
        let lecture = new Lecture(45, "c45", "d45", "25/12/2025", "8:30", "11:30", "1", "45", 45);
        let arrayLecture = [];
        arrayLecture.push(lecture);
        await LectureDao.addLecture(arrayLecture);
        let booking = new Booking("s45", 45, "15/12/2020", "8:30");
        await BookingDao.addBoocking(booking);
        return await BookingDao.getBookedStudentsByLectureId(45).then((s) => assert.strictEqual(s[0].studentId, "s45"));
      });
    });
    //#46
    describe('#Get Teacher Courses Statistics ', function () {
      it('Get Teacher Courses Statistics ', async function () {
        let arrayTeacher = [];
        let teacher = new Person("d46", "teacherName46", "teacherSurname46", "Teacher", "teacher46@test.it", "1234", null, null, "ABCD242");
        arrayTeacher.push(teacher);
        await PersonDao.createPerson(arrayTeacher);
        let course = new Course("c46", "d46", "courseName46", "1", "1");
        let arrayCourse = [];
        arrayCourse.push(course);
        await CourseDao.createCourse(arrayCourse);
        let lecture = new Lecture(46, "c46", "d46", "25/12/2025", "8:30", "11:30", "1", "46", 46);
        let arrayLecture = [];
        arrayLecture.push(lecture);
        await LectureDao.addLecture(arrayLecture);
        let booking = new Booking("s46", 46, "15/12/2020", "8:30");
        await BookingDao.addBoocking(booking);
        return await BookingDao.getTeacherCoursesStatistics("teacher46@test.it").then((c) => assert.strictEqual(c[0].name, "courseName46"));
      });
    });
    //#46.1
    describe('#Get Teacher Courses Statistics ', function () {
      it('Get Teacher Courses Statistics ', async function () {
        return await BookingDao.getAllCoursesStatistics().then((c) => assert.strictEqual(c[0].courseName, "courseName46"));
      });
    });

    //#51
    describe("#Test getAllCoursesStatistics empty", function () {
      it("Gets an empty list of teacher statistics", async function () {
        await PersonDao.deletePersonById("d46");
        await CourseDao.deleteCourseById("c46");
        await LectureDao.deleteLecture(46);
        let teacher = new Person("d50", "teacherName50", "teacherSurname50", "Teacher", "teacher50@test.it", "1234", null, null, "ABCD50");
        let arrayTeacher = [];
        arrayTeacher.push(teacher);
        await PersonDao.createPerson(arrayTeacher);
        let course = new Course("c50", "d50", "courseName50", "year50", "sem50");
        let arrayCourse = [];
        arrayCourse.push(course);
        await CourseDao.createCourse(arrayCourse);
        let lecture = new Lecture(50, "c50", "d50", "31/12/2025", "8:30", "11:30", "1", "50", 50);
        let arrayLecture = [];
        arrayLecture.push(lecture);
        await LectureDao.addLecture(arrayLecture);
        return await BookingDao.getAllCoursesStatistics().then((s) => {
          assert.strictEqual(s, undefined);
        })
      })
    })
  });
  describe('Test contact_tracing_dao', function () {
    //#47
    describe('#Get tracing of a positive student ', function () {
      it('Get the list of students in contact with the positive student ', async function () {
        let today = moment().subtract('1', "day").format("DD/MM/YYYY");
        let prenotation = moment().subtract('2', "days").format("DD/MM/YYYY");
        let arrayStudent = [];
        let arrayLecture = [];
        let positiveStudent = new Person("p47", "positiveName47", "positiveSurname47", "Student", "positive@email.it", "1234", "positive", "18/11/1999", "DERF453");
        let student = new Person("s47", "studentName47", "studentSurname47", "Student", "student47@email.it", "1234", "studentCity", "18/11/1999", "aAFGDD34");
        arrayStudent.push(positiveStudent);
        arrayStudent.push(student);
        let lecture = new Lecture(47, "c47", "d47", today, "8:30", "11:30", "1", "47", 47);
        arrayLecture.push(lecture);
        let booking1 = new Booking("p47", 47, prenotation, "8:30");
        let booking2 = new Booking("s47", 47, prenotation, "8:30");
        let contact = "" + student.id + ", " + student.name + ", " + student.surname + ", " + student.email;
        await PersonDao.createPerson(arrayStudent);
        await LectureDao.addLecture(arrayLecture);
        await BookingDao.addBoocking(booking1);
        await BookingDao.addBoocking(booking2);
        return await ContactTracingDao.getContactTracingByStudent("p47").then((s) => assert.strictEqual(s[0], contact));
      });
    });

  });
  describe('Test lectureDaoHP', function () {
    //#52
    describe('#Get Week Lecture List ', function () {
      it('Get the list of the week lectures of a student ', async function () {
        let today = moment().add("1", "day").format("DD/MM/YYYY")
        let tomorrow = moment().add("2", "days").format("DD/MM/YYYY")
        let arrayEnrollment = [];
        let enrollment = new Enrollment("c52", "s52");
        arrayEnrollment.push(enrollment);
        let lecture = new Lecture(52, "c52", "d52", tomorrow, "8:30", "13:00", "1", "52", 52);
        let lecture1 = new Lecture(43, "c52", "d52", today, "8:30", "13:00", "1", "52", 52);
        let arrayLecture = [];
        arrayLecture.push(lecture);
        arrayLecture.push(lecture1);
        await EnrollmentDao.addEnrollment(arrayEnrollment);
        await LectureDao.addLecture(arrayLecture);
        return await LectureDao.getWeekLecturesList("s52").then((l) => assert.strictEqual(l[0].lectureId, 43));
      });
    });
    //#52
    describe('#Get Week Teacher Lecture List ', function () {
      it('Get the list of the week lectures of a teacher ', async function () {
        return await LectureDao.getWeekTeacherLectureList("d52").then((l) => assert.strictEqual(l[0].lectureId, 43));
      });
    });
    //#53
    describe('#Get Past Lecture like a Teacher ', function () {
      it('Get the list of past lectures of a teacher ', async function () {
        let yesterday = moment().subtract('1', 'day').format("DD/MM/YYYY");
        let lecture = new Lecture(53, "c53", "d53", yesterday, "8:30", "13:00", "1", "53", 53);
        let arrayLecture = [];
        arrayLecture.push(lecture);
        await LectureDao.addLecture(arrayLecture);
        let teacher = new Person("d53", "teacherName53", "teacherSurname53", "Teacher", "teacher53@email.it", "234", null, null, "ZSEDF2");
        let arrayTeacher = [];
        arrayTeacher.push(teacher);
        await PersonDao.createPerson(arrayTeacher);
        let course = new Course("c53", "d53", "courseName53", "1", "1");
        let arrayCourse = [];
        arrayCourse.push(course);
        await CourseDao.createCourse(arrayCourse);
        return await LectureDao.getPastLectures(course.name, teacher.email, "Teacher", teacher.name, teacher.surname)
          .then((l) => assert.strictEqual(l[0].date, lecture.date));
      });
    });
    //#54
    describe('#Get Past Lecture like a Manager ', function () {
      it('Get the list of past lectures like a manager ', async function () {
        let lecture = await LectureDao.getLectureById(53);
        let teacher = await PersonDao.getPersonByID("d53")
        let course = await CourseDao.getCourseByID("c53");
        return await LectureDao.getPastLectures(course.name, teacher.email, "Manager", teacher.name, teacher.surname)
          .then((l) => assert.strictEqual(l[0].date, lecture.date));
      });
    });
  });


  //----------------------------------------- Data loader tests -----------------------------------------//
  describe('Data loader, test', function () {
    const dataLoader = new DataLoader();

    const studentHeader = "Id,Name,Surname,City,OfficialEmail,Birthday,SSN\n";
    const teacherHeader = "Number,GivenName,Surname,OfficialEmail,SSN\n";
    const enrollmentHeader = "Code,Student\n";
    const scheduleHeader = "Code,Room,Day,Seats,Time\n";
    const coursesHeader = "Code,Year,Semester,Course,Teacher\n";

    describe('#Load a student into the system', function () {
      const student = studentHeader + "s8000,Francesco,Bianchi,Turin,francescobianchi@studenti.politu.it,1994-02-02,ABCDEF";
      dataLoader.readStudentsCSV(student);
      it('Load a student', async function () {
        return await PersonDao.getPersonByID("s8000").then((s) => assert.strictEqual(s.email, "francescobianchi@studenti.politu.it"));
      });
    });

    describe('#Load a teacher into the system', function () {
      const teacher = teacherHeader + "d8000,Antonio,Belli,antoniobelli@politu.it,FEDCBA";
      dataLoader.readTeachersCSV(teacher);
      it('Load a teacher', async function () {
        return await PersonDao.getPersonByID("d8000").then((t) => assert.strictEqual(t.email, "antoniobelli@politu.it"));
      });
    });

    describe('#Load a course into the system', function () {
      const course = coursesHeader + "c8000,1,1,Algoritmi,d8000";
      dataLoader.readCoursesCSV(course);
      it('Load a course', async function () {
        return await CourseDao.getCourseByID("c8000").then((c) => assert.strictEqual(c.name, "Algoritmi"));
      });
    });

    describe('#Load an enrollment into the system', function () {
      const enrollment = enrollmentHeader + "c8000,s8000";
      dataLoader.readEnrollmentsCSV(enrollment);
      it('Load an enrollment', async function () {
        return await EnrollmentDao.getEnrollmentById("c8000", "s8000")
          .then(async (e) => assert.strictEqual((await CourseDao.getCourseByID(e.courseId)).name, "Algoritmi"));
      });
    });

    describe('#Load a date schedule into the system', function () {
      const schedule = scheduleHeader + "c8000,12,Mon,16,10:10-11:20\n"
        + "c8000,12,Tue,16,10:20-11:30\n"
        + "c8000,12,Wed,16,10:30-11:40\n"
        + "c8000,12,Thu,16,10:40-11:50\n"
        + "c8000,12,Fri,16,10:50-12:00";
      dataLoader.readScheduleCSV(schedule);
      it('Load a schedule', async function () {
        return await LectureDao.getWeekTeacherLectureList("d8000").then((l) => assert.strictEqual(l[0].startingTime, "10:10"));
      });
    });

  });

  //----------------------------------------- Email sender tests -----------------------------------------//
  describe('Send email, test', function () {

    const correctEmail = "pulsebs14.notification@gmail.com";
    const correctFakeUserEmail = "pulsebs.fakeuser@gmail.com"
    const correctPassword = "team142020";
    const correctService = "gmail";

    let emailSender;

    describe('#EmailSender creation', function () {
      describe('#Error in sender account setup (wrong service)', function () {
        it('this should fail', function () {
          this.timeout(4000); // needed beacuse it takes few seconds to verify that the connection is not valid
          emailSender = new EmailSender("wrongservice", correctEmail, correctPassword)
          return expect(emailSender.verifyConnection()).to.be.rejected;
        });
      });

      describe('#Error in sender account setup (wrong email)', function () {
        it('this should fail', function () {
          emailSender = new EmailSender(correctService, "wrong@email.err", correctPassword);
          return expect(emailSender.verifyConnection()).to.be.rejected;
        });
      });

      describe('#Error in sender account setup (wrong password)', function () {
        it('this should fail', function () {
          emailSender = new EmailSender(correctService, correctEmail, "wrongpassword");
          return expect(emailSender.verifyConnection()).to.be.rejected;
        });
      });

      describe('#Success in sender account setup', function () {
        it('this should work', function () {
          emailSender = new EmailSender(correctService, correctEmail, correctPassword);
          return emailSender.verifyConnection();
        });
      });

    });

    describe('#EmailSender sendEmail method', function () {

      describe('#Error in sendEmail (missing recipient)', function () {
        it('this should fail', function () {
          return expect(emailSender.sendEmail([], "Error in sendEmail (missing recipient)", "Example email body")).to.be.rejected;
        });
      });

      describe('#Error in sendEmail (wrong recipient)', function () {
        it('this should fail', function () {
          return expect(emailSender.sendEmail("wrong", "Error in sendEmail (wrong recipient)", "Example email body")).to.be.rejected;
        });
      });

      describe('#Error in sendEmail (wrong recipients)', function () {
        it('this should fail', function () {
          return expect(emailSender.sendEmail(["wrong", "wrong2"], "Error in sendEmail (wrong recipients", "You shold not be able to read this")).to.be.rejected;
        });
      });


      describe('#Success in sendEmail to one person', function () {
        it('this should work', function () {
          return emailSender.sendEmail(correctFakeUserEmail, "Success in sendEmail to one person", "Example email body");
        });
      });

      describe('#Success in sendEmail to mutilple person', function () {
        it('this should work', function () {
          return emailSender.sendEmail([correctFakeUserEmail, correctEmail], "Success in sendEmail to mutilple person", "Example email body");
        });
      });

      describe('#Success in sendEmail to some person', function () {
        it('this should work', function () {
          return emailSender.sendEmail([correctFakeUserEmail, "wrong"], "Success in sendEmail to some person", "Example email body");
        });
      });

    });

  });

  /**close the server after the test **/
  //after(done => {
  //server.close(done);
  //db.close();
  //db.deleteFromDisk();
  //});

});