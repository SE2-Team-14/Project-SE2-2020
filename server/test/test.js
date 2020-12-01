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
const PersonDao = require('../dao/person_dao');
const CourseDao = require('../dao/course_dao');
const LectureDao = require('../dao/lecture_dao');
const EnrollmentDao = require('../dao/enrollment_dao');
const ClassroomDao = require('../dao/classroom_dao');
const BookingDao = require('../dao/booking_dao');
const CancelledBookingsDao = require('../dao/cancelled_bookings_dao');
const CancelledLecturesDao = require('../dao/cancelled_lectures_dao');
const EmailSender = require('../utils/EmailSender');

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

describe('Server side unit test', function () {

  let server;

  /**start the server before test */
  before(done => {
    server = runServer(done);
  });

  //----------------------------------------- API tests -----------------------------------------//
  describe('Server #GET methods tests', function () {
    //Test that http://localhost:3001/api/student-home/student@test.it/bookable-lectures returns 200
    describe('#Test /api/student-home/:email/bookable-lectures', function () {
      var url = "http://localhost:3001/api/student-home/student@test.it/bookable-lectures";
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
    var path = "/api/student-home/book";
    let b = new Booking("s9", 9, "18/11/2020", "8.30");

    it('should send parameters to : /api/student-home/book POST', function (done) {
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
  describe('Test #POST book', function () {
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
  describe('Test #PUT increase-seats', function () {
    var host = "http://localhost:3001";
    var path = "/api/student-home/increase-seats";
    let lecture = new Lecture(11, "c11", "d11", "12/12/12", "8:30", "10:00", 1, "11", 11);
    it('should send parameters to : /api/student-home/increase-seats PUT', function (done) {
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

  });
  //#12
  describe('Test #PUT decrease-seats', function () {
    var host = "http://localhost:3001";
    var path = "/api/student-home/decrease-seats";
    let lecture = new Lecture(12, "c12", "d12", "12/12/12", "8:30", "10:00", 1, "12", 12);
    it('should send parameters to : /api/student-home/decrease-seats PUT', function (done) {
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
    
  });
  //#13
  describe('Test #PUT change-type of lecture', function () {
    var host = "http://localhost:3001";
    var path = "/api/teacher-home/change-type";
    let lecture = new Lecture(13, "c13", "d13", "12/12/12", "8:30", "10:00", 1, "13", 13);

    LectureDao.addLecture(lecture);

    it('should send parameters to : /api/teacher-home/change-type PUT', function (done) {
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

    
  });

  //----------------------------------------- DAO tests -----------------------------------------//
  describe('Test university members', function () {
    //#14
    describe('#Create a student', function () {
      it('Creates a new student', async function () {
        let testStudent = new Person('s14', 'Andrea', 'Rossi', 'student', 'andrea@rossi', '1234');
        return await PersonDao.createPerson(testStudent);
      });
    });
    //#15
    describe('#Create a teacher', function () {
      it('Creates a new teacher', async function () {
        let testTeacher = new Person('d15', 'Cataldo', 'Basile', 'teacher', 'cataldo@basile', '1234');
        return await PersonDao.createPerson(testTeacher);
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

  });

  describe('Test courses', function () {
    //#16
    describe('#Create a course', function () {
      it('Creates a new course', async function () {
        let testCourse = new Course('c16', 'd16', 'Softeng II');
        return await CourseDao.createCourse(testCourse);
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

  });

  describe('Test enrollment_dao', function () {
    //#17
    describe('#Create an enrollment', function () {
      it('Creates a new enrollment', async function () {
        let testEnrollment = new Enrollment('c17', 'basile@cataldo');
        let student = new Person("s17", "Basile", "Cataldo", "student", "basile@cataldo", "1234");
        let lecture = new Lecture(17, "c17", "d17", "17/12/17", "8:00", "8:10", 1, "17", 17);
        let course = new Course("c17", "d17", "TestCourse17");
        let booking = new Booking("s17", 17, "17/12/17", "8:00");
        return await PersonDao.createPerson(student)
          .then(await LectureDao.addLecture(lecture))
          .then(await CourseDao.createCourse(course))
          .then(await BookingDao.addBoocking(booking))
          .then(await EnrollmentDao.addEnrollment(testEnrollment));
      });
    });
    //#17.1
    describe('#Deletes an enrollment', function () {
      it('Deletes an enrollment', async function () {
        return await EnrollmentDao.deleteEnrollment('c17', 'basile@cataldo')
          .then(await PersonDao.deletePersonById("s17"))
          .then(await CourseDao.deleteCourseById("c17"))
          .then(await BookingDao.deleteBooking("s17", 17))
          .then(await LectureDao.deleteLecture(17));
      });
    });

  });

  describe('Test lectures', function () {
    //#18
    describe('#Gets a list of lectures', function () {
      it("Gets a list of lectures", async function () {
        let today = moment().format("DD/MM/YYYY");
        let lecture = new Lecture(18, "testCourse18", "testTeacher18", today, "8.30", "13.00", "1", "18", 18);
        LectureDao.addLecture(lecture);
        let enrollment = new Enrollment("testCourse18", "test18@testone");
        EnrollmentDao.addEnrollment(enrollment);
        let student = new Person("s18", "testname18", "testsurname18", "student", "test18@testone", "1233");
        PersonDao.createPerson(student);
        return await LectureDao.getLecturesList("test18@testone").then(lectures => assert.strictEqual(lectures[0].courseId, "testCourse18"));
      });
    });
    //#19
    describe('#Gets the list of lectures of the teacher', function () {
      it("Gets a lecture by teacher's id", async function () {
        let tomorrow = moment().add(1, "day").format("DD/MM/YYYY");
        let teacher = new Person("d19", "testTeacherName19", "testTeacherSurname19", "teacher", "teacher19@testone", "1233");
        let lecture = new Lecture(19, "testCourse19", "d19", tomorrow, "8.30", "13.00", "1", "19", 19);
        PersonDao.createPerson(teacher);
        LectureDao.addLecture(lecture);
        return await LectureDao.getTeacherLectureList("d19").then(lectures => assert.strictEqual(lectures[0].courseId, "testCourse19"))
      });
    });
    //#20
    describe('#Gets the new value of seats(+1)', function () {
      it("Gets a new value of seats", async function () {
        let lecture = new Lecture(20, "testCourse20", "d20", "20/11/2020", "8.30", "13.00", "1", "20", 20);
        LectureDao.addLecture(lecture);
        LectureDao.increaseBookedSeats(lecture.lectureId);
        return await LectureDao.getLectureById(20)
          .then((l) => assert.strictEqual(l.numberOfSeats, 21))
      });
    });
    //#21
    describe('#Gets the new value of seats (-1)', function () {
      it("Gets a new value of seats", async function () {
        let lecture = new Lecture(21, "testCourse21", "d21", "21/11/2021", "8.30", "13.00", "1", "21", 21);
        LectureDao.addLecture(lecture);
        LectureDao.decreaseBookedSeats(lecture.lectureId);
        return await LectureDao.getLectureById(21)
          .then((l) => assert.strictEqual(l.numberOfSeats, 20))
      });
    });
    //#22
    describe('#Gets the list of tomorrow lectures', function () {
      it("Gets the list of tomorrow lectures by teacher's id", async function () {
        let tomorrow = moment().format('DD/MM/YYYY');
        let teacher = new Person("d22", "testname22", "testsurname22", "teacher", "teacher22@test", "1233");
        let lecture = new Lecture(22, "testCourseTomorrow22", "d22", tomorrow, "8.30", "13.00", "1", "22", 22);
        PersonDao.createPerson(teacher);
        LectureDao.addLecture(lecture);
        return await LectureDao.getTomorrowsLecturesList("d22")
          .then(lectures => assert.strictEqual(lectures[0].courseId, "testCourseTomorrow22"))
      });
    });
    //#23
    describe('#Change type of a lecture', function () {
      it("Change a lecture by lecture's id", async function () {
        let lecture = new Lecture(23, "testCourse23", "d23", "23/11/2023", "8.30", "13.00", "1", "23", 23);
        LectureDao.addLecture(lecture);
        LectureDao.changeLectureType(lecture.lectureId);
        return await LectureDao.getLectureById(23)
          .then((l) => assert.strictEqual(l.inPresence, "0"))
      });
    });
    //#24
    describe('#Gets a lecture', function () {
      it('Gets a lecture by its id', async function () {
        let tomorrow=moment().format("DD/MM/YYYY")
        let student = new Person("s24", "testname24", "testsurname24", "student", "student24@test", "1233");
        let lecture = new Lecture(24, "testCourse24", "d24", tomorrow, "8.30", "13.00", "1", "24", 24);
        let enrollment = new Enrollment("testCourse24", "student24@test");
        PersonDao.createPerson(student);
        LectureDao.addLecture(lecture);
        EnrollmentDao.addEnrollment(enrollment);
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
        LectureDao.addLecture(testLecture);
        let testCourse = new Course("c28", "testCourse28", "courseName28");
        CourseDao.createCourse(testCourse);
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
          let testCourse = new Course("c29", "testCourse29", "courseName29");
          let testBooking = new Booking("s29", 29, today, "12:00");

          LectureDao.addLecture(testLecture);
          BookingDao.addBoocking(testBooking);
          CourseDao.createCourse(testCourse);
          return await BookingDao.getStatistics(testLecture.date, "lecture", testCourse.name).then((s) => {
            assert.strictEqual(s[0].date, testBooking.date);
          })
        })
      })
      //#30
      describe("#Test week mode", function () {
        it("Gets the list of bookings for the specified week", async function () {
          let testLecture = new Lecture(30, "c30", "testTeacher30", "30/11/2025", "12:00", "13:00", "1", "30", 30);
          let testCourse = new Course("c30", "testCourse30", "courseName30");
          let testBooking = new Booking("s30", 30, "27/11/2020", "12:00");
          LectureDao.addLecture(testLecture);
          BookingDao.addBoocking(testBooking);
          CourseDao.createCourse(testCourse);
          return await BookingDao.getStatistics(null, "week", testCourse.name).then((s) => {
            assert.strictEqual(s[0].bookings, 1);
          })
        })
      })
      //#31
      describe("#Test month mode", function () {
        it("Gets the list of bookings for the specified month", async function () {
          let testLecture = new Lecture(31, "c31", "testTeacher31", "01/12/2025", "12:00", "13:00", "1", "31", 31);
          LectureDao.addLecture(testLecture);
          let testCourse = new Course("c31", "testCourse31", "courseName31");
          CourseDao.createCourse(testCourse);
          let testBooking = new Booking("s31", 31, "27/11/2020", "12:00");
          BookingDao.addBoocking(testBooking);
          return await BookingDao.getStatistics(null, "month", testCourse.name).then((s) => {
            assert.strictEqual(s[0].bookings, 1);
          })
        })
      })
      //#32
      describe("#Test total mode", function () {
        it("Gets the list of all bookings of the course, divided by single lecture", async function () {
          let testLecture = new Lecture(32, "c32", "testTeacher32", "2/12/2025", "12:00", "13:00", "1", "32", 32);
          LectureDao.addLecture(testLecture);
          let testCourse = new Course("c32", "testCourse", "courseName32");
          CourseDao.createCourse(testCourse);
          let testBooking = new Booking("s32", 32, "27/11/2020", "12:00");
          BookingDao.addBoocking(testBooking);
          return await BookingDao.getStatistics(null, "total", testCourse.name).then((s) => {
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
        let testCourse = new Course("c36", "testCourse36", "courseName36");
        LectureDao.addLecture(testLecture);
        CourseDao.createCourse(testCourse);
        return await BookingDao.getStatistics(null, "total", testCourse.name).then((s) => {
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
        let testCourse = new Course("c38", "testCourse38", "courseName38");
        let testCancBooking = new CancelledBooking(38, "s38", 38, "27/11/2020");
        LectureDao.addLecture(testLecture);
        CourseDao.createCourse(testCourse);
        CancelledBookingsDao.addCancelledBooking(testCancBooking);
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
  after(done => {
    server.close(done);
    db.deleteFromDisk();
  });

});