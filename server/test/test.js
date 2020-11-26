'use strict';

const assert = require('assert');
const Person = require('../person');
const Course = require('../course');
const Lecture = require('../lecture');
const Enrollment = require('../enrollment');
const Classroom = require('../classroom');
const Booking = require('../booking');
const CancelledBooking = require('../cancelled_bookings');
const CancelledLecture = require('../cancelled_lectures');
const PersonDao = require('../person_dao');
const CourseDao = require('../course_dao');
const LectureDao = require('../lecture_dao');
const EnrollmentDao = require('../enrollment_dao');
const ClassroomDao = require('../classroom_dao');
const BookingDao = require('../booking_dao');
const CancelledBookingsDao = require('../cancelled_bookings_dao');
const CancelledLecturesDao = require('../cancelled_lectures_dao');

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

    describe('#Test /api/student-home/:email/bookable-lectures', function () {
      var url = "http://localhost:3001/api/student-home/student@test.it/bookable-lectures";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    describe('#Test /api/student-home/student@test.it/bookable-lectures', function () {
      let student = new Person("s12345", "testName", "testSurname", "Student", "student@test.it", "Password");
      PersonDao.createPerson(student);
      let lecture = new Lecture(12345, "testCourseId", "testTeacherId", "testDate", "testStartingTime", "testEndingTime", "1", 12, 0);
      LectureDao.addLecture(lecture);
      let enrollment = new Enrollment("testCourseId", "student@test.it");
      EnrollmentDao.addEnrollment(enrollment);
      var url = "http://localhost:3001/api/student-home/student@test.it/bookable-lectures";
      it("returns lecture 12345", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(lecture));
          done();
        });
      });
    });

    describe('#Test /api/getCourses/body', function () {
      let course = new Course("courseTestId", "teacherTestId", "nameTestCourse");
      CourseDao.createCourse(course);
      var url = "http://localhost:3001/api/getCourses";
      it("returns courseTestId", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(course));
          expect(response.statusCode).to.equal(200);
          done();
        });
      });

    });

    describe('#Test /api/getTeachers', function () {
      var url = "http://localhost:3001/api/getTeachers";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    describe('#Test /api/getTeachers/body', function () {
      let teacher = new Person(1, "testName", "testSurname", "Teacher", "teacher@test.it", "password");
      PersonDao.createPerson(teacher);
      var url = "http://localhost:3001/api/getTeachers";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(teacher));
          done();
        });
      });
    });

    describe('#Test /api/getClassrooms', function () {
      var url = "http://localhost:3001/api/getClassrooms";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    describe('#Test /api/getClassrooms/body', function () {
      let classroom = new Classroom("10A", 50);
      ClassroomDao.addClassroom(classroom);
      var url = "http://localhost:3001/api/getClassrooms";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(classroom));
          done();

        });
      });

    });

    describe('#Test /api/name', function () {
      var url = "http://localhost:3001/api/name";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    describe('#Test /api/getAllBookings', function () {
      var url = "http://localhost:3001/api/getAllBookings";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });

    describe('#Test /api/getAllBookings/body', function () {
      let booking = new Booking(1, 154, "date", "startingTime");
      BookingDao.addBoocking(booking);
      var url = "http://localhost:3001/api/getAllBookings";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(booking));
          done();
        });
      });
      BookingDao.deleteBooking(booking);
    });


    describe("#Test /api/getCourses", function () {
      var url = "http://localhost:3001/api/courses";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        })
      })
    })

    describe("#Test /api/getCourses/body", function () {
      let course = new Course(1, "d123", "TestCourse");
      CourseDao.createCourse(course);
      var url = "http://localhost:3001/api/courses";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(course));
          done();
        });
      });
      CourseDao.deleteCourseById(course.courseId);
    })


    describe("#Test /api/getEnrollments", function () {
      var url = "http://localhost:3001/api/enrollment";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        })
      })
    })

    describe("#Test /api/getEnrollments/body", function () {
      let student = new Person("s1", "TestN", "TestS", "Student", "test@email", "Testing");
      PersonDao.createPerson(student);
      let lecture = new Lecture(10, "c1", "d123", "today", "now", "now+60", true, "7i", 50);
      LectureDao.addLecture(lecture);
      let booking = new Booking("s1", 10, "today", "now");
      BookingDao.addBoocking(booking);
      let res = { studentId: student.id, date: lecture.date, startingTime: lecture.startingTime, endingTime: lecture.endingTime, classroomId: lecture.classroomId };
      var url = "http://localhost:3001/api/enrollment";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(res));
          done();
        })
      })
      PersonDao.deletePersonById(student.id);
      LectureDao.deleteLecture(lecture.lectureId);
      BookingDao.deleteBooking(student.id, lecture.lectureId);
    })


    describe("#Test /api/getPersonName", function () {
      var url = "http://localhost:3001/api/name";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        })
      })
    })

    describe("#Test /api/getPersonName/body", function () {
      let person = new Person(1, "TestName", "TestSurname", "Teacher", "email@test.com", "Testing");
      PersonDao.createPerson(person);
      var url = "http://localhost:3001/api/name";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.body).to.deep.include(Array.from(person));
          done();
        })
      })
      PersonDao.deletePersonById(person.id);
    })

  });

  describe('Test #POST book', function () {
    var host = "http://localhost:3001";
    var path = "/api/student-home/book";
    let b = new Booking("s123", 1, "18/11/2020", "8.30");
    
    it('should send parameters to : /api/student-home/book POST', function (done) {
      chai
        .request(host)
        .post(path)
        .set('content-type', 'application/json')
        .send({ booking: b, studentName: "testName", courseName: "testCourse", date: "18/11/2020", startingTime: "8.30", recipient: "test@email.com" })
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

  describe('Test #POST book', function () {
    var host = "http://localhost:3001";
    var path = "/api/student-home/delete-book";

    it('should send a request to delete a booking: /api/student-home/delete-book DELETE', function (done) {
      chai
        .request(host)
        .del(path)
        .set('content-type', 'application/json')
        .send({ studentId: "s123", lectureId: 1 })
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

  describe('Test #PUT increase-seats', function () {
    var host = "http://localhost:3001";
    var path = "/api/student-home/increase-seats";

    it('should send parameters to : /api/student-home/increase-seats PUT', function (done) {
      chai
        .request(host)
        .put(path)
        .set('content-type', 'application/json')
        .send({ lectureId: '1' })
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

  describe('Test #PUT decrease-seats', function () {
    var host = "http://localhost:3001";
    var path = "/api/student-home/decrease-seats";

    it('should send parameters to : /api/student-home/decrease-seats PUT', function (done) {
      chai
        .request(host)
        .put(path)
        .set('content-type', 'application/json')
        .send({ lectureId: '1' })
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

    describe('#Gets enrolled students', function () {
      it('Gets the list of the students enrolled to the course', function () {
        return EnrollmentDao.getEnrolledStudentsByCourseName("Test course").then(students => assert.strictEqual(students[0].studentId, "s12"));
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
          let lecture = new Lecture(null, "testCourse", "testTeacher", "19/11/2020", "8.30", "13.00", "1", "71", 10000);
          PersonDao.createPerson(student);
          EnrollmentDao.addEnrollment(enrollment);
          LectureDao.addLecture(lecture);
          return LectureDao.getLecturesList("test@testone").then(lectures => assert.strictEqual(lectures[0].courseId, "testCourse"));
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

    const EmailSender = require('../sendemail/EmailSender');
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