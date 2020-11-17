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
    describe('#Test /api/courses', function () {
      var url = "http://localhost:3001/api/courses";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });
    describe('#Test /api/enrollment', function () {
      var url = "http://localhost:3001/api/enrollment";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });
    describe('#Test /api/getCourses', function () {
      var url = "http://localhost:3001/api/getCourses";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
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
    describe('#Test /api/getClassrooms', function () {
      var url = "http://localhost:3001/api/getClassrooms";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
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

    describe("#Test /api/getCourses", function () {
      var url = "http://localhost:3001/api/courses";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        })
      })
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

    describe("#Test /api/getPersonName", function () {
      var url = "http://localhost:3001/api/name";
      it("returns status 200", function (done) {
        request(url, function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        })
      })
    })

  });

  describe('Test #POST book', function () {
    var host = "http://localhost:3001";
    var path = "/api/student-home/book";

    it('should send parameters to : /api/student-home/book POST', function (done) {
      chai
        .request(host)
        .post(path)
        //.field({studentId: 's1234' , lectureId: '1', date: 'd', startingTime: 'd'})
        .set('content-type', 'application/json')
        .send({ studentId: 's1234', lectureId: '1', date: 'd', startingTime: 'd' })
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

  describe('Various tests', function () {


    describe('#Test a test that should fail', function () {
      it('this should fail', function () {
        let classroom = new Classroom('12', 50);
        ClassroomDao.addClassroom(classroom);
        let lecture = new Lecture(null, 'C12', 'D12', '12/12/12', '12.00', '12.12', 'true', '12', 100);
        expect(LectureDao.addLecture(lecture), 'Cannot register a lecture with more seats than max seats for the classroom').to.be.rejected;
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
        PersonDao.getPersonByID('d1234').then(person => assert.strictEqual('Cataldo', person.name));
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

  });

  describe('Test courses', function () {

    describe('#Create a course', function () {
      it('Creates a new course', function () {
        let testCourse = new Course('01ABC', 'd1234', 'Softeng II');
        return CourseDao.createCourse(testCourse);
      });
    });

    describe('#Gets a course name', function () {
      it('Test course name', function () {
        CourseDao.getCourseByID('01ABC').then(course => assert.strictEqual('Softeng II', course.name));
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