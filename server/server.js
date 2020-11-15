const express = require('express');
//everything here is required for the authentication setup
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const morgan = require('morgan'); // logging middleware
const expireTime = 1800;
const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const lectureDao = require('./lecture_dao');
const personDao = require('./person_dao')
const courseDao = require("./course_dao");
const enrollmentDao = require("./enrollment_dao");
// Authorization error
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

//const OfficerDao = require("./officer_dao");

const PORT = 3001;

app = new express();

// Set-up logging
app.use(morgan('tiny'));

app.use(express.json());


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

module.exports = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));


app.post('/api/login', (req, res) => {
  const officerAccount = req.body;
  if (!officerAccount) {
    res.status(400).end();
  } else {
    personDao.getPersonByEmail(officerAccount.email)
      .then((user) => {
        if (user === undefined || user.password != officerAccount.password) {
          res.status(200).json({ error_no: -1, error_info: "Email or password is wrong." })
        } else {
          //AUTHENTICATION SUCCESS
          //const token = jsonwebtoken.sign({ user: user.officerID }, jwtSecret, {expiresIn: expireTime});
          //res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
          res.status(200).json({ user: { name: user.name, email: user.email, role: user.role }, error_no: 0, error_info: "Login successfully." });
        }
      }).catch(
        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
          new Promise((resolve) => { setTimeout(resolve, 1000) }).then(() => res.status(401).json(authErrorObj))
        }
      );
  }
})

//Network part for book a seat
app.get('/api/student-home/:email/bookable-lectures', (req, res) => {
  lectureDao.getLecturesList(req.params.email)
    .then((lectures) => {
      res.json(lectures);
    })
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
});

//returns all courses taught by a teacher
app.get("/api/courses", (req, res) => {
  courseDao.getCoursesOfTeacher(req.query.teacher).then((courses) => {
    res.json(courses);
  })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: "Error while getting courses of a teacher" }],
      });
    });
})

//returns all students booked for a specific course
app.get("/api/enrollment", (req, res) => {
  enrollmentDao.getEnrolledStudentsByCourseName(req.query.course).then((students) => {
    let empty = [];
    if (students === undefined) {
      res.json(empty)
    }
    res.json(students);
  })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: "Error while getting enrolled students" }],
      });
    });
})

app.get("/api/getCourseName/:courseId", (req, res) => {
  courseDao.getCourseName(req.params.courseId).then((name) => res.json(name))
  .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

//----------------------COOKIE--------------------------
//TODO: to be tested (if needed)
/*
app.use(cookieParser());


// For the rest of the code, all APIs require authentication
app.use(
  jwt({
    secret: jwtSecret,
    getToken: req => req.cookies.token
  })
);
*/

