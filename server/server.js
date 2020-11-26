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
const cancelledLectureDao = require('./cancelled_lectures_dao');
const Booking = require('./booking');
const EmailSender = require('./sendemail/EmailSender');
const setMidnightTimer = require("./midnightTimer");
const midnightTimer = require('./midnightTimer');
const moment = require('moment');
const CancelledLectures = require('./cancelled_lectures');
const cancelledBookingsDao = require("./cancelled_bookings_dao");


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
setMidnightTimer(() => sendEmailsAtMidnight());

function sendEmailsAtMidnight() {

  personDao.getTeachers().then((teachers) => {
    for (let teacher of teachers) {
      lectureDao.getTomorrowsLecturesList(teacher.id).then((lectures) => {
        for (let lecture of lectures) {
          courseDao.getCourseByID(lecture.courseId).then((courses) => {
            for (let course of courses) {
              console.log("Sending an email to: " + teacher.email);
              const recipient = teacher.email;
              const subject = "Bookings ended";
              const message = `Dear ${teacher.name},\n` +
                `bookings for the course ${course.name} ended. ` +
                `${lecture.numberOfSeats} students have booked their seats.\n` +
                `You can get the complete list of the students on your personal page.\n`;

              emailSender.sendEmail(recipient, subject, message);
            }
          })
        }
      }
      )
    }
  })
}


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

/**
 * GET API 
 * Request parameters: string containing the email of the teacher one wants to know the taught courses
   Request body content: none
   Response body content: list of courses taught by said teacher
 */
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

/**
 * GET API 
 * Request parameters: string containing the name of the course for which a teacher wants to have a list of all booked students
   Request body content: none
   Response body content: list of booked students for all lectures of the course
 */
app.get("/api/bookedStudents", (req, res) => {
  bookingDao.getBookedStudentsByCourseName(req.query.course).then((students) => {
    let empty = [];
    if (students === undefined) {
      res.json(empty)
    }
    res.json(students);
  })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: "Error while getting booked students" }],
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

app.get('/api/getTeacherLectures/:id', (req, res) => {
  let id = req.params.id;
  lectureDao.getTeacherLectureList(id).then((lectures) => res.json(lectures))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

//POST api/student-home/book
app.post('/api/student-home/book', (req, res) => {
  const booking = req.body.booking;
  const recipient = req.body.recipient;
  const subject = "Booking confirmed";
  const message = `Dear ${req.body.studentName},\n` +
    `your booking for the course ${req.body.courseName} ` +
    `of ${req.body.date} at ${req.body.startingTime} has been confirmed.\n` +
    `Please if you cannot be present for the lecture remeber to cancel your booking.\n` +
    `Have a nice lesson and remember to wear the mask. Togheter we can defeat Covid.`;
  if (!booking) {
    res.status(400).end();
  } else {
    bookingDao.addBoocking(booking)
      .then(() => res.status(200).end())
      .catch((err) => res.status(500).json({ errors: [{ msg: err }] }))
      .then(emailSender.sendEmail(recipient, subject, message));
  }
});

app.delete('/api/student-home/delete-book', (req, res) => {
  const lectureId = req.body.lectureId;
  const studentId = req.body.studentId;
  bookingDao.deleteBooking(studentId, lectureId)
    .then(() => res.status(200).end())
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
});

//PUT api/student-home/increase-seats
app.put('/api/student-home/increase-seats', (req, res) => {
  const lecture = req.body;
  if (lecture.numberOfSeats == null)
    lecture.numberOfSeats = 0;
  if (!lecture) {
    res.status(400).end();
  } else {
    lectureDao.increaseBookedSeats(lecture.lectureId)
      .then(() => res.status(200).end())
      .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
  }
});

//PUT api/student-home/decrease-seats
app.put('/api/student-home/decrease-seats', (req, res) => {
  const lecture = req.body;

  if (!lecture) {
    res.status(400).end();
  } else {
    lectureDao.decreaseBookedSeats(lecture.lectureId)
      .then(() => res.status(200).end())
      .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
  }
});

/**
 * GET API
 * Request Parameters: email, a string containing the email corresponding to the person one wants to have the name and surname of
 * Request Body Content: none
 * Response Body Content: information about the person (name, surname, email)
 */
app.get("/api/name", (req, res) => {
  personDao.getPersonByEmail(req.query.email).then((person) => {
    res.json(person)
  }).catch((err) => {
    res.status(500).json({
      errors: [{ msg: "Error while getting person" }],
    });
  });
})

app.get("/api/pastLectures", (req, res) => {
  lectureDao.getPastLectures(req.query.course).then((lectures) => {
    res.json(lectures)
  }).catch((err) => {
    res.status(500).json({
      errors: [{ msg: "Error while getting past lectures" }],
    });
  });
})

/**
 * GET API
 * Request Parameters: - date: string containing the date of a lecture a teacher wants to have statistics about; set to null if the parameter mode is not equal to "lecture"
 *                     - mode: string containing the mode of statistics a teacher wants to have (days for a single lecture, divided by week, divided by month, total bookings divided by lecture)
 *                     - course: string containing the name of the course for which the teacher wants to have statistics
 * Request Body Content: none
 * Response Body Content: array containing those statistics
 */
app.get("/api/statistics", (req, res) => {
  bookingDao.getStatistics(req.query.date, req.query.mode, req.query.course).then((stats) => {
    res.json(stats)
  }).catch((err) => {
    res.status(500).json({
      errors: [{ msg: "Error while getting statistics" }],
    });
  });
})

app.put('/api/teacher-home/change-type', (req, res) => {
  const lecture = req.body;
  console.log(lecture);
  if (!lecture) {
    res.status(400).end();
  } else {
    lectureDao.changeLectureType(lecture.lectureId)
      .then(() => res.status(200).end())
      .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
  }
});

app.delete('/api/teacher-home/delete-lecture', (req, res) => {
  const lecture = req.body.lecture;
  if (!lecture) {
    res.status(400).end();
  } else {
    lectureDao.deleteLecture(lecture.lectureId)
      .then(() => res.status(200).end())
      .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
  }
});

app.post('/api/teacher-home/add-cancelled-lecture', (req, res) => {
  const lecture = req.body.lecture;
  const cancelledLecture = new CancelledLectures();
  cancelledLecture.courseId = lecture.courseId;
  cancelledLecture.teacherId = lecture.teacherId;
  cancelledLecture.date = lecture.date;
  cancelledLecture.inPresence = lecture.inPresence;
  if (!lecture) {
    res.status(400).end();
  } else {
    cancelledLectureDao.addCancelledLecture(cancelledLecture)
      .then((id) => (res.status(201).json({ "id": id })))
      .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
  }
});

/**
 * GET API
 * Request Parameters: course, a string containing the name of the course for which a teacher wants to have statistics about cancelled bookings
 * Request Body Content: none
 * Response Body Content: array containing those statistics
 */
app.get("/api/cancelledBookings", (req, res) => {
  cancelledBookingsDao.getCancelledBookingsStats(req.query.course).then((stats) => {
    res.json(stats)
  }).catch((err) => {
    res.status(500).json({
      errors: [{ msg: "Error while getting statistics" }],
    });
  })
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
