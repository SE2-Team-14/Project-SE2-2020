/* Template for Unit test;
Install:
    $ npm install --global mocha
Execute
    $ cd server
    $ npm test
*/

// DON'T USE ARROW FUNCTION HERE, OTHERWISE TESTS WILL FAIL BECAUSE OF BINDING ISSUES
// MAYBE IT'S BETTER TO NOT TOUCH THE FIRST TEST IN ORDER TO USE THEM AS DOCUMENTATION

'use strict';

const assert = require('assert');
const Person = require('../person');
const Course = require('../course');
const Lecture = require('../lecture');
const Enrollment = require('../enrollment');
const Classroom = require('../classroom');
const Booking = require('../booking');
const PersonDao = require('../person_dao');
const CourseDao = require('../course_dao');
const LectureDao = require('../lecture_dao');
const EnrollmentDao = require('../enrollment_dao');
const ClassroomDao = require('../classroom_dao');
const BookingDao = require('../booking_dao');

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
/*
//---------------------------------EXAMPLES TO USE MOCHA---------------------------------

//----------------BASIC SYNCH ASSERTION---------------

describe('Test sync Assetion', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.strictEqual([1, 2, 3].indexOf(4), -1);
    });
  });
});


//--------------BASIC ASYNCH ASSERTION---------------------

//this is only a sample async function;
async function asynFunc(callback){
    console.log("Hello!");
    callback(/*-1/); // if you pass an error here, the test will fail!
}

describe('Test Async Assertion', function() {
    describe('#asynFunc()', function() {
      it('Sould print \'Hello!\' on the console', function(done) {
      asynFunc(function(err) {
          if (err) done(err); // calling done inform that the test is finished
          else done();
        });
      });
    });
  });


  //------------------BASIC PROMISE ASSERTION---------------
  // DO NOT USE done() WHEN WORKING WITH PROMISES!

async function promiseFunc(message){
    return new Promise((resolve, reject) => {
        if (isNaN(message)){
            console.log(message);
            resolve(null);
        }else{
            reject(-1);
        }
    });
  }
  
describe('Test Async Test', function() {
    describe('#promiseFunc()', function() {
        it('should print \'Hello promise!\' on the console', function() {
        return promiseFunc("Hello promise!"); // Fail if the promise fail too
        });
    });
});

  //-------------------BASIC HOOK MANAGEMENT---------------

  describe('hooks templates', function() {
    before(function() {
      // runs once before the first test in this block
    });
  
    after(function() {
      // runs once after the last test in this block
    });
  
    beforeEach(function() {
      // runs before each test in this block
    });
  
    afterEach(function() {
      // runs after each test in this block
    });
  
    // test cases
  });
*/

//---------------------------OUR TEST------------------------------

describe('Server side unit test', function () {


  let server;

  /**start the server before test */
  before(done => {
    server = runServer(done);
  });

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

    /*describe('#Test /api/getCourses', function () {
      var url = "http://localhost:3001/api/getCourses";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          
          done();
        });
      });
    });*/

    /*
    describe('#Test /api/getCourses', function () {
      var url = "http://localhost:3001/api/getCourses";
      it("returns status 500", function (done) {
        request(url, function (error, response, body) {

          expect(response.statusCode).to.equal(500);
          done();
        });
      });
    });
    */

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
        //.field({studentId: 's1234' , lectureId: '1', date: 'd', startingTime: 'd'})
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
    BookingDao.deleteBooking("s123", 1);
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

  describe('Test enrollments', function () {

    describe('#Create an enrollment', function () {
      it('Creates a new enrollment', function () {
        //For now i assume that we consider things that are not in the db
        let testEnrollment = new Enrollment('C123', 's123@email.it');
        return EnrollmentDao.addEnrollment(testEnrollment);
      });
    });


    describe('#Deletes an enrollment', function () {
      it('Deletes an enrollment', function () {
        return EnrollmentDao.deleteEnrollment('C123', 's123@email.it');
      });
    });

  });

  describe('Test lectures', function () {

    describe('#Gets a list of lectures', function () {
      it("Gets a lecture by teacher's id", function () {
          let enrollment = new Enrollment("testCourse", "test@testone");
          let student = new Person("s444", "testname", "testsurname", "student", "test@testone", "1233");
          let lecture = new Lecture(null, "testCourse", "testTeacher", "19/11/2020", "8.30", "13.00", "true", "71", 10000);
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

  describe('Test bookings', function () {

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