'use strict';

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
          EnrollmentDao.deleteEnrollment("testCourseId1", "student1@test.it")
                       .then(PersonDao.deletePersonById("s1"))
                       .then(LectureDao.deleteLecture(1));
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
          CourseDao.deleteCourseById("testCourseId2");
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
          PersonDao.deletePersonById("d3");
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
          ClassroomDao.deleteClassroom("4");
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
          BookingDao.deleteBooking("5", 5);
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
          LectureDao.deleteLecture(lecture.lectureId);
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
          CourseDao.deleteCourseById(7);
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
          PersonDao.deletePersonById(person.id);
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
            LectureDao.deleteLecture(11);
            done();
          }
        });
    });
    
  });

  describe('Test #PUT decrease-seats', function () {
    var host = "http://localhost:3001";
    var path = "/api/student-home/decrease-seats";
    let lecture = new Lecture(1000, "C18", "C17", "12/12/12", "8:30", "10:00", 1, "77", 12);
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
    LectureDao.deleteLecture(lecture);
  });

  describe('Test #PUT change-type of lecture', function () {
    var host = "http://localhost:3001";
    var path = "/api/teacher-home/change-type";
    let lecture = new Lecture(10000, "C127", "C18", "12/12/12", "8:30", "10:00", 1, "18", 12);

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

    LectureDao.deleteLecture(10000);
  });

  //----------------------------------------- DAO tests -----------------------------------------//
  describe('Test university members', function () {

    describe('#Create a student', function () {
      it('Creates a new student', function () {
        let testStudent = new Person('s1234', 'Andrea', 'Rossi', 'student', 'andrea@rossi', '1234');
        return PersonDao.createPerson(testStudent);
      });
    });

    describe('#Create a teacher', function () {
      it('Creates a new teacher', function () {
        let testTeacher = new Person('d1234', 'Cataldo', 'Basile', 'teacher', 'cataldo@basile', '1234');
        return PersonDao.createPerson(testTeacher);
      });
    });

    describe('Get person name', function () {
      it('Get name', function () {
        return PersonDao.getPersonByID('d1234').then(person => assert.strictEqual('Cataldo', person.name));
      });
    });

    describe('#Delete a student', function () {
      it('Deletes a student', function () {
        return PersonDao.deletePersonById('s1234');
      });
    });

    describe('#Delete a teacher', function () {
      it('Deletes a teacher', function () {
        return PersonDao.deletePersonById('d1234');
      });
    });

    describe("#Delete someone doesn't exist", function () {
      it('Deletes nobody', function () {
        return PersonDao.deletePersonById("-1");
      });
    });

  });

  describe('Test courses', function () {

    describe('#Create a course', function () {
      it('Creates a new course', function () {
        let testCourse = new Course('01ABC', 'd1234', 'Softeng II');
        return CourseDao.createCourse(testCourse);
      });
    });

    describe('#Gets a course by its id', function () {
      it('Test course name', function () {
        return CourseDao.getCourseByID('01ABC').then(course => assert.strictEqual('Softeng II', course.name));
      });
    });

    describe('#Delete a course', function () {
      it('Deletes a course', function () {
        return CourseDao.deleteCourseById('01ABC');
      });
    });

  });

  describe('Test enrollment_dao', function () {

    describe('#Create an enrollment', function () {
      it('Creates a new enrollment', function () {
        let testEnrollment = new Enrollment('C123', 'basile@cataldo');
        let student = new Person("s12", "Basile", "Cataldo", "student", "basile@cataldo", "1234");
        let lecture = new Lecture(100000, "C123", "D1234", "12/12/12", "8:00", "8:10", 1, "77", null);
        let course = new Course("C123", "D1234", "Test course");
        let booking = new Booking("s12", 100000, "12/12/12", "8:00");
        return PersonDao.createPerson(student)
          .then(LectureDao.addLecture(lecture))
          .then(CourseDao.createCourse(course))
          .then(BookingDao.addBoocking(booking))
          .then(EnrollmentDao.addEnrollment(testEnrollment));
      });
    });

    describe('#Deletes an enrollment', function () {
      it('Deletes an enrollment', function () {
        return EnrollmentDao.deleteEnrollment('C123', 'basile@cataldo')
          .then(PersonDao.deletePersonById("s12"))
          .then(CourseDao.deleteCourseById("C123"))
          .then(BookingDao.deleteBooking("s12", 100000))
          .then(LectureDao.deleteLecture(100000));
      });
    });

  });

  describe('Test lectures', function () {

    describe('#Gets a list of lectures', function () {
      it("Gets a lecture by teacher's id", function () {
        let enrollment = new Enrollment("testCourse", "test@testone");
        let student = new Person("s444", "testname", "testsurname", "student", "test@testone", "1233");
        let lecture = new Lecture(2, "testCourse", "testTeacher", "19/11/2020", "8.30", "13.00", "1", "71", 10000);
        PersonDao.createPerson(student);
        EnrollmentDao.addEnrollment(enrollment);
        LectureDao.addLecture(lecture);
        return LectureDao.getLecturesList("test@testone").then(lectures => assert.strictEqual(lectures[0].courseId, "testCourse"))
        .then(LectureDao.deleteLecture(2))
        .then(PersonDao.deletePersonById("s444"))
        .then(EnrollmentDao.deleteEnrollment("testCourse", "test@testone"));
      });
    });

    describe('#Gets the list of lectures of the teacher', function () {
      it("Gets a lecture by teacher's id", function () {
        let teacher = new Person("d444", "testTeacherName", "testTeacherSurname", "teacher", "teacher@testone", "1233");
        let lecture = new Lecture(3, "testCourse", "d444", "28/11/2020", "8.30", "13.00", "1", "71", 10000);
        PersonDao.createPerson(teacher);
        LectureDao.addLecture(lecture);
        return LectureDao.getTeacherLectureList("d444").then(lectures => assert.strictEqual(lectures[0].courseId, "testCourse"))
        .then(LectureDao.deleteLecture(lecture.lectureId))
        .then(PersonDao.deletePersonById("d444"));
      });
    });

    describe('#Gets the new value of seats(+1)', function () {
      it("Gets a new value of seats", function () {
        let lecture = new Lecture(10000, "testCourse", "d444", "19/11/2020", "8.30", "13.00", "1", "71", 1);
        LectureDao.addLecture(lecture);
        LectureDao.increaseBookedSeats(lecture.lectureId);
        return LectureDao.getLectureById(10000)
          .then((l) => assert.strictEqual(l.numberOfSeats, 2))
          .then(LectureDao.deleteLecture(10000));
        //return assert.strictEqual(lecture.numberOfSeats, 3);
      });
    });

    describe('#Gets the new value of seats (-1)', function () {
      it("Gets a new value of seats", function () {
        let lecture = new Lecture(10000, "testCourse", "d444", "19/11/2020", "8.30", "13.00", "1", "71", 1);
        LectureDao.addLecture(lecture);
        LectureDao.decreaseBookedSeats(lecture.lectureId);
        return LectureDao.getLectureById(10000)
          .then((l) => assert.strictEqual(l.numberOfSeats, 0))
          .then(LectureDao.deleteLecture(10000));
      });
    });

    describe('#Gets the list of tomorrow lectures', function () {
      it("Gets the list of tomorrow lectures by teacher's id", function () {
        let tomorrow = moment().format('DD/MM/YYYY');
        let teacher = new Person("d4445", "testname", "testsurname", "teacher", "teacher@test", "1233");
        let lecture = new Lecture(10000, "testCourseTomorrow", "d4445", tomorrow, "8.30", "13.00", "1", "71", 10000);
        PersonDao.createPerson(teacher);
        LectureDao.addLecture(lecture);
        return LectureDao.getTomorrowsLecturesList("d4445")
          .then(lectures => assert.strictEqual(lectures[0].courseId, "testCourseTomorrow"))
          .then(LectureDao.deleteLecture(10000))
          .then(PersonDao.deletePersonById("d4445"));
      });
    });

    describe('#Change type of a lecture', function () {
      it("Change a lecture by lecture's id", function () {
        let lecture = new Lecture(10000, "testCourse", "d444", "19/11/2020", "8.30", "13.00", "1", "71", 1);
        LectureDao.addLecture(lecture);
        LectureDao.changeLectureType(lecture.lectureId);
        return LectureDao.getLectureById(10000)
          .then((l) => assert.strictEqual(l.inPresence, "0"))
          .then(LectureDao.deleteLecture(10000));
      });
    });

    describe('#Gets a lecture', function () {
      it('Gets a lecture by its id', function () {
        return LectureDao.getLecturesList("test@testone").then(lectures => LectureDao.getLectureById(lectures[0].lectureId).then((lecture => assert.strictEqual(lecture.courseId, "testCourse"))));
      });
    });

    describe('#Deletes a lecture', function () {
      it('Deletes a lecture', function () {
        return LectureDao.getLecturesList("test@testone").then(lectures => LectureDao.getLectureById(lectures[0].lectureId).then((lecture => LectureDao.deleteLecture(lecture.lectureId))));
      });
    });

    describe('#Deletes the enrollment', function () {
      it("Deletes the previous enrollment", function () {
        return EnrollmentDao.deleteEnrollment("testCourse", "test@testone");
      });
    });

    describe('#Deletes the student', function () {
      it("Deletes the previous student", function () {
        return PersonDao.deletePersonById("s444");
      });
    });

  });

  describe('Test classroom', function () {

    describe('#Create a classroom', function () {
      it('Creates a new classroom', function () {
        let testClassroom = new Classroom('7test', 30);
        return ClassroomDao.addClassroom(testClassroom);
      });
    });

    describe('#Delete a classroom', function () {
      it('Deletes a classroom', function () {
        return ClassroomDao.deleteClassroom('7test');
      });
    });

  });

  describe('Test booking_dao', function () {

    describe('#Add a booking', function () {
      it('Creates a new booking', function () {
        let testBooking = new Booking('S1223', 1, 'today', '12.00');
        return BookingDao.addBoocking(testBooking);
      });
    });

    describe('#Delete booking', function () {
      it('Deletes a booking', function () {
        return BookingDao.deleteBooking('S1223', 1);
      });
    });

    describe('#Delete booking by teacher', function () {
      it('Delete a booking when a teacher delete or change a lecture', function () {
        let testBooking = new Booking('s123456', 1, 'tomorrow', '15:00');
        BookingDao.addBoocking(testBooking);
        return BookingDao.deleteBookingByTeacher(1);
      });
    });

    describe("#Test getBookedStudentsByCourseName", function () {
      it("Gets the list of booked students for future lectures", function () {
        let testLecture = new Lecture(11111, "Ctest", "testTeacher", "30/11/2025", "12:00", "13:00", true, "5A", 20);
        let testCourse = new Course("Ctest", "testCourse", "CtestName");
        let testBooking = new Booking("s1000", 11111, "27/11/2020", "12:00", "November", "23/11/2020-29/11/2020");
        LectureDao.addLecture(testLecture);
        BookingDao.addBoocking(testBooking);
        CourseDao.createCourse(testCourse);
        return BookingDao.getBookedStudentsByCourseName("CtestName").then((b) => {
          assert.strictEqual(b[0].studentId, testBooking.studentId)
          LectureDao.deleteLecture(testLecture.lectureId);
          CourseDao.deleteCourseById(testCourse.courseId);
          BookingDao.deleteBooking(testBooking.studentId, testBooking.lectureId);
        });
      })
    })

    describe("Test getStatistics", function () {

      describe("#Test lecture mode", function () {
        it("Gets the list of bookings for the specified lecture", function () {
          let today = moment().format("DD/MM/YYYY");
          let testLecture = new Lecture(11111, "Ctest", "testTeacher", "30/11/2025", "12:00", "13:00", true, "5A", 20);
          let testCourse = new Course("Ctest", "testCourse", "CtestName");
          let testBooking = new Booking("s1000", 11111, today, "12:00");

          LectureDao.addLecture(testLecture);
          BookingDao.addBoocking(testBooking);
          CourseDao.createCourse(testCourse);
          return BookingDao.getStatistics(testLecture.date, "lecture", testCourse.name).then((s) => {
            assert.strictEqual(s[0].date, testBooking.date);
            LectureDao.deleteLecture(testLecture.lectureId);
            CourseDao.deleteCourseById(testCourse.courseId);
            BookingDao.deleteBooking(testBooking.studentId, testBooking.lectureId);
          })
        })
      })

      describe("#Test week mode", function () {
        it("Gets the list of bookings for the specified week", function () {
          let testLecture = new Lecture(11111, "Ctest", "testTeacher", "30/11/2025", "12:00", "13:00", true, "5A", 20);
          let testCourse = new Course("Ctest", "testCourse", "CtestName");
          let testBooking = new Booking("s1000", 11111, "27/11/2020", "12:00");
          LectureDao.addLecture(testLecture);
          BookingDao.addBoocking(testBooking);
          CourseDao.createCourse(testCourse);
          return BookingDao.getStatistics(null, "week", testCourse.name).then((s) => {
            assert.strictEqual(s[0].bookings, 1);
            LectureDao.deleteLecture(testLecture.lectureId);
            CourseDao.deleteCourseById(testCourse.courseId);
            BookingDao.deleteBooking(testBooking.studentId, testBooking.lectureId);
          })
        })
      })

      describe("#Test month mode", function () {
        it("Gets the list of bookings for the specified month", function () {
          let testLecture = new Lecture(11111, "Ctest", "testTeacher", "30/11/2025", "12:00", "13:00", true, "5A", 20);
          let testCourse = new Course("Ctest", "testCourse", "CtestName");
          let testBooking = new Booking("s1000", 11111, "27/11/2020", "12:00");
          LectureDao.addLecture(testLecture);
          BookingDao.addBoocking(testBooking);
          CourseDao.createCourse(testCourse);
          return BookingDao.getStatistics(null, "month", testCourse.name).then((s) => {
            assert.strictEqual(s[0].bookings, 1);
            LectureDao.deleteLecture(testLecture.lectureId);
            CourseDao.deleteCourseById(testCourse.courseId);
            BookingDao.deleteBooking(testBooking.studentId, testBooking.lectureId);
          })
        })
      })

      describe("#Test total mode", function () {
        it("Gets the list of all bookings of the course, divided by single lecture", function () {
          let testLecture = new Lecture(11111, "Ctest", "testTeacher", "30/11/2025", "12:00", "13:00", true, "5A", 20);
          let testCourse = new Course("Ctest", "testCourse", "CtestName");
          let testBooking = new Booking("s1000", 11111, "27/11/2020", "12:00");
          LectureDao.addLecture(testLecture);
          BookingDao.addBoocking(testBooking);
          CourseDao.createCourse(testCourse);
          return BookingDao.getStatistics(null, "total", testCourse.name).then((s) => {
            assert.strictEqual(s[0].date, testLecture.date);
            LectureDao.deleteLecture(testLecture.lectureId);
            CourseDao.deleteCourseById(testCourse.courseId);
            BookingDao.deleteBooking(testBooking.studentId, testBooking.lectureId);
          })
        })
      })
    });

  });

  describe('Test cancelled_bookings_dao', function () {

    describe('#Adds a deleted booking', function () {
      it('Creates and adds a new deleted booking', function () {
        let cancelledBooking = new CancelledBooking(null, "s123", 1, "12/12/12");
        return CancelledBookingsDao.addCancelledBooking(cancelledBooking);
      });
    });

    describe('#Delete a cancelled booking', function () {
      it('Deletes the cancelled booking added before', function () {
        return CancelledBookingsDao.getCancelledBookings().then(cb => CancelledBookingsDao.deleteCancelledBooking(cb[0].cancelledBookingId));
      });
    });

    describe("#Test getCancelledBookingsStats", function () {
      it("Gets a list of deleted bookings for all lectures of a course", function () {
        let testLecture = new Lecture(11111, "Ctest", "testTeacher", "30/11/2025", "12:00", "13:00", true, "5A", 20);
        let testCourse = new Course("Ctest", "testCourse", "CtestName");
        let testCancBooking = new CancelledBooking(11110, "s1000", 11111, "27/11/2020");
        LectureDao.addLecture(testLecture);
        CourseDao.createCourse(testCourse);
        CancelledBookingsDao.addCancelledBooking(testCancBooking);
        return CancelledBookingsDao.getCancelledBookingsStats(testCourse.name).then((s) => {
          assert.strictEqual(s[0].date, testLecture.date);
          LectureDao.deleteLecture(testLecture.lectureId);
          CourseDao.deleteCourseById(testCourse.courseId);
          CancelledBookingsDao.deleteCancelledBooking(testCancBooking.cancelledBookingId);
        })
      })
    })

  });

  describe('Test cancelled_lectures_dao', function () {

    describe('#Adds a deleted lecture', function () {
      it('Creates and adds a new deleted lecture', function () {
        let cancelledLecture = new CancelledLecture(null, "testCourse", "testTeacher", "12/12/12", "1");
        return CancelledLecturesDao.addCancelledLecture(cancelledLecture);
      });
    });

    describe('#Delete a cancelled lecture', function () {
      it('Deletes the cancelled lecture added before', function () {
        return CancelledLecturesDao.getCancelledLectures().then(cl => CancelledLecturesDao.deleteCancelledLecture(cl[0].cancelledLectureId));
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
  });

});