const express = require('express');
//everything here is required for the authentication setup
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const morgan = require('morgan'); // logging middleware
const expireTime = 1800;
const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const lectureDao = require('./dao/lecture_dao');
const personDao = require('./dao/person_dao')
const courseDao = require("./dao/course_dao");
const enrollmentDao = require("./dao/enrollment_dao");
const classroomDao = require('./dao/classroom_dao');
const bookingDao = require('./dao/booking_dao');
const cancelledLectureDao = require('./dao/cancelled_lectures_dao');
const waitingListDao = require('./dao/waiting_list_dao');
const Booking = require('./bean/booking');
const EmailSender = require('./utils/EmailSender');
const setMidnightTimer = require("./utils/midnightTimer");
const moment = require('moment');
const CancelledLectures = require('./bean/cancelled_lectures');
const CancelledBooking = require('./bean/cancelled_bookings');
const cancelledBookingsDao = require("./dao/cancelled_bookings_dao");
const DataLoader = require('./utils/DataLoader');


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

/**
 * Sends, at midnight of every day, an email to every teacher involved in the booking system an email reporting the lectures that will take place in the day to come and the number of students booked for every lecture
 */
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

/**
 * POST API
  - Request Parameters: none
  - Request Body Content: object that contains the information of the credentials (username, password)
  - Response Body Content: object that contains the name of the user, his id, email and role in the University
  - Error: if wrong credentials
 */
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

/**
 * GET API
 * Request Parameters: none 
 * Request Body Content: none
 * Response Body Content: array of Lecture objects
 */
app.get('/api/student-home/:email/bookable-lectures', (req, res) => {
  lectureDao.getLecturesList(req.params.email)
    .then((lectures) => {
      res.json(lectures);
    })
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
});

/**
 * GET API 
 * Request Parameters: string containing the email of the teacher one wants to know the taught courses
   Request Body Content: none
   Response Body Content: list of courses taught by said teacher
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

/**
 * GET API
 * Request Parameters: none
 * Request Body Content: none
 * Response Body Content: an array of Course objects
 */
app.get("/api/getCourses", (req, res) => {
  courseDao.getCourses().then((courses) => res.json(courses))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/**
 * GET API
 * Request Parameters: none
 * Request Body Content: none
 * Response Body Content: an array of Person objects where all objects have the role of a Teacher
 */
app.get("/api/getTeachers", (req, res) => {
  personDao.getTeachers().then((teachers) => res.json(teachers))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/**
 * GET API
 * Request Parameters: none
 * Request Body Content: none
 * Response Body Content: an array of Classroom objects
 */
app.get("/api/getClassrooms", (req, res) => {
  classroomDao.getClassrooms().then((classrooms) => res.json(classrooms))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/**
 * GET API
 * Request Parameters: none
 * Request Body Content: none
 * Response Body Content: an array of Booking objects
 */
app.get('/api/getAllBookings', (req, res) => {
  bookingDao.getAllBookings().then((bookings) => res.json(bookings))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/**
 * GET API
 * Request Parameters: string containing the identifier of the student whose future bookings are to be retrieved
 * Request Body Content: none
 * Response Body Content: an array of Booking objects containing all bookings for future lectures of the student
 */
app.get('/api/getBookings/:studentId', (req, res) => {
  let studentId = req.params.studentId;
  bookingDao.getBookings(studentId).then((bookings) => res.json(bookings))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/**
 * GET API
 * Request Parameters: string containing the identifier of the teacher whose future lectures are to be retrieved
 * Request Body Content: none
 * Response Body Content: an array of Lecture objects containing all future lectures of the teacher
 */
app.get('/api/getTeacherLectures/:id', (req, res) => {
  let id = req.params.id;
  lectureDao.getTeacherLectureList(id).then((lectures) => res.json(lectures))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/**
 * POST API
 * Request Parameters: none
 * Request Body Content: Booking object containing information about a booking made by a student, array containing the email of the student that made the booking
 * Response Body Content: none
 */
app.post('/api/bookings', (req, res) => {
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

/**
 * DELETE API
 * Request Parameters: none
 * Request Body Content: integer corresponding to the identifier of a booked lecture, string containing the identifier of the student that booked said lecture and then deleted the booking
 * Response Body Content: none
 */
app.delete('/api/student-home/delete-book', (req, res) => {
  const lectureId = req.body.lectureId;
  const studentId = req.body.studentId;
  bookingDao.deleteBooking(studentId, lectureId)
    .then(() => res.status(200).end())
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
});
/*
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
*/

/**
 * PUT API
 * Request Parameters: none
 * Request Body Content: Lecture object containing information about a lecture that needs to be updated
 * Response Body Content: none
 */
app.put('/api/lectures', (req, res) => {
  const lecture = req.body;

  if (!lecture) {
    res.status(400).end();
  } else {
    lectureDao.updateLecture(lecture)
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

/**
 * GET API
 * Request Parameters: a string containing the name of the course whose past lectures are to be retrieved
 * Request Body Content: none
 * Response Body Content: an array of Lecture objects, ordered by the date in which the lecture took place
 */
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
    let empty = [];
    if (stats === undefined) {
      stats = empty;
    }
    res.json(stats)
  }).catch((err) => {
    res.status(500).json({
      errors: [{ msg: err }],
    });
  });
})

/*
app.put('/api/teacher-home/change-type', (req, res) => {
  const lecture = req.body;
  //console.log(lecture);
  if (!lecture) {
    res.status(400).end();
  } else {
    lectureDao.changeLectureType(lecture.lectureId)
      .then(() => res.status(200).end())
      .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
  }
});
*/

/**
 * DELETE API
 * Request Parameters: none
 * Request Body Content: a Lecture object corresponding to the lecture to be deleted
 * Response Body Content: none
 * 
 * After the lesson has been deleted from the database an email is sent to all students that were booked for said lesson to inform them of the cancellation
 */
app.delete('/api/teacher-home/delete-lecture', (req, res) => {
  const lecture = req.body.lecture;
  if (!lecture) {
    res.status(400).end();
  } else {
    bookingDao.getBookedStudentsByLectureId(lecture.lectureId).then((list) => {
      for (let item of list) {
        personDao.getPersonByID(item.studentId).then(student => {
          const subject = 'Lecture cancelled';
          const recipient = student.email;
          const message = `Dear ${student.name},\n` +
            `the lecture for the course ${item.name} of ${item.date} at ${item.startingTime} has been cancelled.`;

          emailSender.sendEmail(recipient, subject, message);
        })
      }
    })
    lectureDao.deleteLecture(lecture.lectureId).then(() => {
      res.status(200).end()
    }).catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
  }
});

/**
 * POST API
 * Request Parameters: none
 * Request Body Content: a Lecture object containing information about a cancelled lecture that has to be added to the appropriate table in the database
 * Response Body Content: an integer corresponding to the identifier of the cancelled lecture
 */
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
 * POST API
 * Request Parameters: none
 * Request Body Content: a string containing the identifier of the student that made the now deleted booking, an integer corresponding to the lecture whose status has been changed
 * Response Body Content: an integer corresponding to the identifier of the cancelled booking
 */
app.post('/api/teacher-home/add-cancelled-booking', (req, res) => {
  const studentId = req.body.studentId;
  const lectureId = req.body.lectureId;
  const date = moment().format("DD/MM/YYYY");
  const cancelledBooking = new CancelledBooking();
  cancelledBooking.studentId = studentId;
  cancelledBooking.lectureId = lectureId;
  cancelledBooking.date = date;
  if (!studentId || !lectureId) {
    res.status(400).end();
  } else {
    cancelledBookingsDao.addCancelledBooking(cancelledBooking)
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

/**
 * DELETE API
 * Request Parameters: none
 * Request Body Content: an integer corresponding to the lecture whose status has been changed
 * Response Body Content: none
 * 
 * Booking cancellation is performed when a teacher changes an in presence lecture to be virtual or directly deletes it; bookings are deleted for all students.
 */
app.delete('/api/teacher-home/deleteBookingByTeacher', (req, res) => {
  let lectureId = req.body.lectureId;
  if (!lectureId) {
    res.status(400).end();
  } else {
    bookingDao.deleteBookingByTeacher(lectureId)
      .then(() => res.status(200).end())
      .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
  }
})

/**
 * GET API
 * Request Parameters: an integer corresponding to the identifier of the lecture to be retrieved
 * Request Body Content: none
 * Response Body Content: a Lecture object containing information about the desired lecture
 */
app.get('/api/getLectureById/:lectureId', (req, res) => {
  let lectureId = req.params.lectureId;
  lectureDao.getLectureById(lectureId).then((lectures) => res.json(lectures))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/**

 * POST API
 * Request Parameters: none
 * Request Body Content: 
 * Response Body Content: 
 */
app.post('/api/load-students', (req, res) => {
  const dataLoader = new DataLoader();
  const filePath = 'data/Students.csv';

  dataLoader.readStudentsCSV(filePath)
    .then(async (result) => (await res.status(201).json(result.lenght)))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));

});

/**
 * POST API
 * Request Parameters: none
 * Request Body Content: 
 * Response Body Content: 
 */
app.post('/api/load-teachers', (req, res) => {
  const dataLoader = new DataLoader();
  const filePath = 'data/Professors.csv';

  dataLoader.readTeachersCSV(filePath)
    .then(async (result) => (await res.status(201).json(result.lenght)))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));

});

/**
 * POST API
 * Request Parameters: none
 * Request Body Content: 
 * Response Body Content: 
 */
app.post('/api/load-enrollments', (req, res) => {
  const dataLoader = new DataLoader();
  const filePath = 'data/Enrollment.csv';

  dataLoader.readEnrollmentsCSV(filePath)
    .then(async (result) => (await res.status(201).json(result.lenght)))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));

});

/**
 * POST API
 * Request Parameters: none
 * Request Body Content: 
 * Response Body Content: 
 */
app.post('/api/load-courses', (req, res) => {
  const dataLoader = new DataLoader();
  const filePath = 'data/Courses.csv';

  dataLoader.readCoursesCSV(filePath)
    .then(async (result) => (await res.status(201).json(result.lenght)))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));

});

/**
 * POST API
 * Request Parameters: none
 * Request Body Content: 
 * Response Body Content: 
 */
app.post('/api/load-schedule', (req, res) => {
  const dataLoader = new DataLoader();
  const filePath = 'data/Schedule.csv';

  dataLoader.readScheduleCSV(filePath)
    .then(async (result) => (await res.status(201).json(result.lenght)))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));

});

//-----------------------------------WAITING LIST------------------------------------

/**
 * POST API
 * Request Parameters: 
 * Request Body Content:
 * Response Body Content: 
 */
app.post('/api/student-home/put-in-queue', (req, res) => {
  const studentId = req.body.studentId;
  const courseId = req.body.courseId;
  const lectureId = req.body.lectureId;

  if (!courseId || !lectureId) {
    res.status(400).end();
  } else {
    waitingListDao.insertInWaitingList(studentId, courseId, lectureId)
      .then(() => (res.status(200).end()))
      .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
  }
});

/**
 * GET API
 * Request Parameters: 
 * Request Body Content: 
 * Response Body Content: 
 */
app.get('/api/studentInWaitinglist', (req, res) => {
  waitingListDao.getFirstStudentInWaitingList(req.query.courseId, req.query.lectureId)
    .then((result) => res.json(result.studentId))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/* GET API
* Request Parameters: a string containing the email of a teacher that wants to know all bookings made for all his courses
* Request Body Content: none
* Response Body Content: an array containing all bookings made for all courses of a teacher
*/
app.get("/api/allCoursesStatistics", (req, res) => {
  bookingDao.getTeacherCoursesStatistics(req.query.teacher).then((stats) => {
    res.json(stats)
  }).catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

app.get("/api/getAllCourses", (req, res) => {
  courseDao.getCourses().then((courses) => {
    res.json(courses)
  }).catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

app.get("/api/allCoursesStats", (req, res) => {
  bookingDao.getAllCoursesStatistics().then((stats) => {
    res.json(stats)
  }).catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
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
