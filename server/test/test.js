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
const PersonDao = require('../person_dao');
const CourseDao = require('../course_dao');
const LectureDao = require('../lecture_dao');

const chai = require('chai');
const chaiHttp = require('chai-http');
const Server = require('../server');

chai.should();
chai.use(chaiHttp);

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
        return promiseFunc("Hello promise!"); // Fail if the promise fail to
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

/*
describe('API tests', function() {

  //Test the GET
  describe('#GET /officers', function() {
    it('Should get all the officers', function(done) {
      chai.request(Server)
          .get('/api/services')
          .end((err, res)  => {
            console.log(res.body);
            res.should.have.status(200);
            done();
          })
    })
  })
});

describe('Test counter', function () {

  describe('#Create counter', function () {
    it('Creates a new counter', function () {
      let testCounter = new Counter(null, '8', '13');
      return CounterDao.createCounter(testCounter);
    });
  });

  describe('#Get all counters', function () {
    it('Should get all counter', function () {
      CounterDao.getCounters().then(counters => console.log(counters));

    });
  });

});

describe('Test officer', function () {

  describe('#Create officer', function () {
    it('Creates a new officer', function () {
      let testOfficer = new Officer(null, 'Bruno', 'Barbieri', 'false', 'bruno@barbieri', '1234');
      return OfficerDao.createOfficerAccount(testOfficer);
    });
  });

  describe('#Create manager', function () {
    it('Creates a new manager', function () {
      let testManager = new Officer(null, 'Joe', 'Bastianich', 'true', 'joe@bastianich', '4321');
      return OfficerDao.createOfficerAccount(testManager);
    });
  });

  describe('#Get an officer by email', function () {
    it('Get by email', function () {
      let email = 'bruno@barbieri';
      
      OfficerDao.getOfficerByEmail(email).then(officer => console.log(officer));

    });
  });

});
*/

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

  describe('#Delete a course', function () {
    it('Deletes a course', function () {
      return CourseDao.deleteCourseById('01ABC');
    });
  });

});


describe('Test lecture', function () {

  describe('#Create a lecture', function () {
    it('Creates a new lecture', function () {
      //For now i assume that we consider things that are not in the db
      let testLecture = new Lecture('C123', 'd123', 'today', '1.00', '2.30', 'true', '7i');
      return LectureDao.addLecture(testLecture);
    });
  });

  /*describe('#Delete a course', function () {
    it('Deletes a course', function () {
      return CourseDao.deleteCourseById('01ABC');
    });
  });*/

});