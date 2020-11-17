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
const classroomDao = require('./classroom_dao');
const bookingDao = require('./booking_dao');
const Booking = require('./booking');
const EmailSender = require('./sendemail/EmailSender');

// Authorization error
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

const PORT = 3001;

let app = new express();

// Set-up logging
app.use(morgan('tiny'));

app.use(express.json());


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

run = (callback) => { return app.listen(PORT, callback); }; // needed in order to make unit testing
module.exports = run;
if (require.main === module) { // start the server only if it is not imported by other modules (i.e. test module)
  run(() => console.log(`Server running on http://localhost:${PORT}/`));
}

const emailSender = new EmailSender('gmail', "pulsebs14.notification@gmail.com", "team142020");

app.post('/api/login', (req, res) => {
  const person = req.body;
  if (!person) {
    res.status(400).end();
  } else {
    personDao.getPersonByEmail(person.email)
      .then((user) => {
        if (user === undefined || user.password != person.password) {
          res.status(200).json({ error_no: -1, error_info: "Email or password is wrong." })
        } else {
          //AUTHENTICATION SUCCESS
          //const token = jsonwebtoken.sign({ user: user.officerID }, jwtSecret, {expiresIn: expireTime});
          //res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
          res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, error_no: 0, error_info: "Login successful." });
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

app.get("/api/getCourses", (req, res) => {
  courseDao.getCourses().then((courses) => res.json(courses))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

app.get("/api/getTeachers", (req, res) => {
  personDao.getTeachers().then((teachers) => res.json(teachers))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

app.get("/api/getClassrooms", (req, res) => {
  classroomDao.getClassrooms().then((classrooms) => res.json(classrooms))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

app.get('/api/getAllBookings', (req, res) => {
  bookingDao.getAllBookings().then((bookings) => res.json(bookings))
  .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

//POST api/student-home/book
app.post('/api/student-home/book', (req, res) => {
  const booking = req.body;
  if (!booking) {
    res.status(400).end();
  } else {
    bookingDao.addBoocking(booking)
      .then(() => res.status(200).end())
      .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
  }
});

//PUT api/student-home/increase-seats
app.put('/api/student-home/increase-seats', (req, res) => {
  const lecture = req.body;

  if (!lecture) {
    res.status(400).end();
  } else {
    lectureDao.increaseBookedSeats(lecture.lectureId)
      .then(() => res.status(200).end())
      .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
  }
});

app.get("/api/name", (req, res) => {
  personDao.getPersonByEmail(req.query.email).then((person) => {
    console.log("server", person)
    res.json(person)
  }).catch((err) => {
    res.status(500).json({
      errors: [{ msg: "Error while getting enrolled students" }],
    });
  });
})

app.post('/api/send-email', (req, res) => {
  const message = req.body.message;
  const subject = req.body.subject;
  const recipient = req.body.recipient;

  emailSender.sendEmail(recipient, subject, message)
    .then(() => res.status(200).end)
    .catch((err) => {
    res.status(500).json({
      errors: [{ msg: "Error while sending email" }],
    })
  });
}); 
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