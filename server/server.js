const express = require('express');
//everything here is required for the authentication setup
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const morgan = require('morgan'); // logging middleware
const bodyParser = require('body-parser');
const expireTime = 1800;
const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const lectureDao = require('./dao/lecture_dao');
const personDao = require('./dao/person_dao')
const courseDao = require("./dao/course_dao");
const contactTracingDao = require("./dao/contact_tracing_dao");
const classroomDao = require('./dao/classroom_dao');
const bookingDao = require('./dao/booking_dao');
const cancelledLectureDao = require('./dao/cancelled_lectures_dao');
const waitingListDao = require('./dao/waiting_list_dao');
const EmailSender = require('./utils/EmailSender');
const setMidnightTimer = require("./utils/midnightTimer");
const moment = require('moment');
const CancelledLectures = require('./bean/cancelled_lectures');
const CancelledBooking = require('./bean/cancelled_bookings');
const cancelledBookingsDao = require("./dao/cancelled_bookings_dao");
const ScheduleDao = require("./dao/schedule_dao");
const DataLoader = require('./utils/DataLoader');

// Authorization error
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

const PORT = 3001;

let app = new express();

// Set-up logging
app.use(morgan('tiny'));

//app.use(express.json());

app.use(bodyParser.json({ limit: "50mb", extended: true }))

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
app.get('/api/student-home/:id/bookable-lectures', (req, res) => {
  lectureDao.getLecturesList(req.params.id)
    .then((lectures) => {
      res.json(lectures);
    })
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
});

app.get('/api/student-home/:id/week-lectures', (req, res) => {
  lectureDao.getWeekLecturesList(req.params.id)
    .then((lectures) => {
      res.json(lectures);
    })
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
});

app.get('/api/teacher-home/:id/week-teacher-lectures', (req, res) => {
  lectureDao.getWeekTeacherLectureList(req.params.id)
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
 * Response Body Content: an array of Course objects
 */
app.get("/api/getCoursesByYear", (req, res) => {

  let year = req.query.years;
  courseDao.getCoursesByYear(year).then((courses) => res.json(courses))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/**
 * GET API
 * Request Parameters: none
 * Request Body Content: none
 * Response Body Content: an array of Course objects
 */
app.get("/api/getCoursesByYearAndSemester", (req, res) => {
  let years = req.query.years;
  let semester = req.query.semester;
  courseDao.getCoursesByYearAndSemester(years, semester).then((courses) => res.json(courses))
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
 * Request Parameters: day in which classrooms are being searched for, starting time and ending time of the interval classes are being searched for
 * Request Body Content: none
 * Response Body Content: an array of Classroom objects
 */
app.get("/api/getFullClassrooms", (req, res) => {
  classroomDao.getFullClassrooms(req.query.day, req.query.start, req.query.end).then((classrooms) => res.json(classrooms))
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

  bookingDao.addBoocking(booking)
    .then(() => res.status(200).end())
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }))
    .then(emailSender.sendEmail(recipient, subject, message));

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
    .then(() => {
      waitingListDao.getFirstStudentInWaitingList(lectureId)
        .then((result) => {
          if (result !== undefined) {
            lectureDao.getLectureById(lectureId).then((lecture) => {
              bookingDao.addBoocking({ studentId: result.studentId, lectureId: lectureId, startingTime: lecture.startingTime }).then(() => {
                lecture.numberOfSeats++;
                lectureDao.updateLecture(lecture);
                waitingListDao.deleteFromWaitingList(result.studentId, lectureId).then(() => {
                  personDao.getPersonByID(result.studentId).then((person) => {

                    courseDao.getCourseByID(lecture.courseId).then((course) => {
                      const subject = "Moved from waiting list";
                      const message = `Dear ${person.name} ${person.surname},\n` +
                        `you have been moved from the waiting list of the course ` + course.name +
                        `of ${lecture.date} at ${lecture.startingTime} to the the list of students booked as someone has canceled his booking.\n` +
                        `Don't forget to attend the lecture.`
                      emailSender.sendEmail(person.email, subject, message);
                    })
                  })
                })
              })
            })
          }
        })
      res.status(200).end()
    })

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

  if (lecture.inPresence === "0") {
    bookingDao.getBookedStudentsByLectureId(lecture.lectureId).then((bookings) => {
      for (let book of bookings) {
        personDao.getPersonByID(book.studentId).then((student) => {
          const subject = "Lecture switched to virtual";
          const recipient = student.email;
          const message = `Dear ${student.name} ${student.surname},\n` +
            `the lecture for the course ${book.name} of ${book.date} at ${book.startingTime} has been turned into a remote lecture.\n` +
            `Kind regards.`;
          emailSender.sendEmail(recipient, subject, message);
        })
      }
    })
  }
  lectureDao.updateLecture(lecture)
    .then(() => {

      res.status(200).end()
    })
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));

});

/**
 * PUT API
 * Request Parameters: none
 * Request Body Content: 
 * Response Body Content: none
 */
app.put('/api/modifyLectures', (req, res) => {
  const courses = req.body.courses;
  lectureDao.modifyLectures(courses)
    .then(() => res.status(200).end())
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));

});

/*app.put('/api/support-officer-home/lectures', (req, res) => {
  const lecture = req.body;

  lectureDao.modifyLecture(lecture)
    .then(() => {
      bookingDao.getBookedStudentsByLectureId(lecture.lectureId).then((list) => {
        for (let item of list) {
          personDao.getPersonByID(item.studentId).then(student => {
            const subject = 'Lecture modified';
            const recipient = student.email;
            const message = `Dear ${student.name},\n` +
              `the lecture for the course ${item.name} of ${item.date} at ${item.startingTime} has been modified.`;

            emailSender.sendEmail(recipient, subject, message);
          })
        }
      })
      res.status(200).end()
    })
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));

})*/

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
  lectureDao.getPastLectures(req.query.course, req.query.teacher, req.query.role, req.query.name, req.query.surname).then((lectures) => {
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

//-----------------------------------DATA LOADER------------------------------------

/**
 * POST API
 * Request Parameters: none
 * Request Body Content: 
 * Response Body Content: 
 */
app.post('/api/data-loader', (req, res) => {
  const dataLoader = new DataLoader();

  const fileData = req.body.fileData;
  const fileType = req.body.fileType;

  switch (fileType) {
    case "student":
      dataLoader.readStudentsCSV(fileData)
        .then(async (result) => (await res.status(201).json({ result })))
        .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
      break;
    case "teacher":
      dataLoader.readTeachersCSV(fileData)
        .then(async (result) => (await res.status(201).json({ result })))
        .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
      break;
    case "enrollment":
      dataLoader.readEnrollmentsCSV(fileData)
        .then(async (result) => (await res.status(201).json({ result })))
        .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
      break;
    case "schedule":
      dataLoader.readScheduleCSV(fileData)
        .then(async (result) => (await res.status(201).json({ result })))
        .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
      break;
    case "course":
      dataLoader.readCoursesCSV(fileData)
        .then(async (result) => (await res.status(201).json({ result })))
        .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
      break;
  }

});

/**
 * GET POST
 * Request Parameters: none
 * Request Body Content: identifier of the course whose schedule is being changed, day of the week of the old schedule, schedule object containing the new schedule, starting time of the old schedule
 * Response Body Content: none
 */
app.post('/api/modifySchedule', (req, res) => {
  let courseId = req.body.courseId;
  let dayOfWeek = req.body.dayOfWeek;
  let schedule = req.body.schedule;
  let oldStart = req.body.oldStart;
  const dataLoader = new DataLoader();

  lectureDao.getLectureByCourseId(courseId, dayOfWeek)
    .then((lectures) => {

      bookingDao.getFutureBookingsOfDay(dayOfWeek, courseId, oldStart).then((items) => {
        for (let item of items) {
          personDao.getPersonByID(item.studentId).then((student) => {
            const subject = "Schedule changed";
            const recipient = student.email;
            let newDate = null;
            let diff = moment(item.lectureDate, "DD/MM/YYYY").day() - moment(schedule.dayOfWeek, "ddd").day();
            if (diff > 0) {
              newDate = moment(item.lectureDate, "DD/MM/YYYY").subtract(diff, "days").format("DD/MM/YYYY");
            } else {
              newDate = moment(item.lectureDate, "DD/MM/YYYY").add(-diff, "days").format("DD/MM/YYYY");
            }
            const message = `Dear ${student.name} ${student.surname}\n` +
              `the lecture for the course ${item.name} of ${item.lectureDate} at ${item.start} has changed schedule.\n` +
              `It will now take place on ${newDate} at ${schedule.startingTime} in class ${schedule.classroom}.\n` +
              `Remember to book a seat again if you still want to follow the lecture!\n` +
              `Kind regards.`;
            emailSender.sendEmail(recipient, subject, message);
          })
        }
      })
      for (let lecture of lectures) {
        lectureDao.deleteLecture(lecture.lectureId);
        bookingDao.deleteBookingByTeacher(lecture.lectureId);
      }
      dataLoader.modifySchedule(schedule, courseId, dayOfWeek, oldStart);
    }).then(res.status(200).end())
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
});

/**
 * GET POST
 * Request Parameters: 
 * Request Body Content: none
 * Response Body Content: 
 */
app.post('/api/modifySchedule-by-date', (req, res) => {
  let startingDate = req.body.startingDate;
  let endingDate = req.body.endingDate;

  lectureDao.getLecturesToModify(startingDate, endingDate).then((lectures) => {
    lectureDao.modifyLecturesByDate(startingDate, endingDate)
    for (let lecture of lectures)
      bookingDao.deleteBookingByTeacher(lecture.lectureId)
  }).then(res.status(200).end())
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
});

/**
 * GET API
 * Request Parameters: 
 * Request Body Content: none
 * Response Body Content:
 */
app.get('/api/getSchedule', (req, res) => {
  ScheduleDao.getSchedule().then((schedule) => {
    if (schedule !== undefined) {
      res.json(schedule)
    } else {
      res.json([])
    }
  })
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

app.get("/api/getScheduleByCourseId", (req, res) => {
  ScheduleDao.getScheduleByCourseId(req.query.id).then((schedule) => {
    if (schedule !== undefined) {
      res.json(schedule)
    } else {
      res.json([]);
    }
  }).catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})


//-----------------------------------WAITING LIST------------------------------------

/**
 * GET API
 * Request Parameters: none
 * Request Body Content: none
 * Response Body Content: an array of Booking objects
 */
app.get('/api/getAllWaitingList', (req, res) => {
  waitingListDao.getAllWaitingList().then((waitingList) => res.json(waitingList))
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
});

/**
 * POST API
 * Request Parameters: 
 * Request Body Content:
 * Response Body Content: 
 */
app.post('/api/student-home/put-in-queue', (req, res) => {
  const studentId = req.body.studentId;
  const lectureId = req.body.lectureId;

  if (!studentId || !lectureId) {
    res.status(400).end();
  } else {
    waitingListDao.insertInWaitingList(studentId, lectureId)
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
  waitingListDao.getFirstStudentInWaitingList(req.query.lectureId)
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

app.get("/api/getAllLectures", (req, res) => {
  lectureDao.getAllLecturesList().then((lectures) => {
    res.json(lectures)
  }).catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/**
 * GET API
 * Request Parameters: none
 * Request Body Content: none
 * Response Body Content: an array containing the total count of bookings made for each course
 */
app.get("/api/allCoursesStats", (req, res) => {
  bookingDao.getAllCoursesStatistics().then((stats) => {
    res.json(stats)
  }).catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/**
 * GET API
 * Request Parameters: none
 * Request Body Content: none
 * Response Body Content: an array containing all courses with name and surname of the teacher in charge of each course
 */
app.get("/api/getCoursesAndTeachers", (req, res) => {
  courseDao.getCoursesAndTeachers().then((courses) => {
    res.json(courses);
  }).catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/**
 * GET API
 * Request Parameters: none
 * Request Body Content: none
 * Response Body Content: an array containing statistics about cancelled lectures for every course
 */
app.get("/api/cancelledLecturesStats", (req, res) => {
  cancelledLectureDao.getCancelledLecturesStats().then((stats) => {
    res.json(stats);
  }).catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/**
 * GET API
 * Request Parameters: an integer corresponding to the identifier of the teacher that wants to know his current lecture
 * Request Body Content: none
 * Response Body Content: a Lecture object containing information about the current lecture
 */
app.get("/api/currentLecture", (req, res) => {
  lectureDao.getCurrentLecture(req.query.teacherId).then((lecture) => {
    res.json(lecture);
  }).catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/**
 * Request Parameters: an integer corresponding to the identifier of a lecture taking place at the current time
 * Request Body Content: none
 * Response Body Content: an array of Bookings containing all bookings made for the lecture taking place at the current time
 */
app.get("/api/bookingsOfLecture", (req, res) => {
  bookingDao.getBookingsOfLecture(req.query.id).then((bookings) => {
    res.json(bookings);
  }).catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

/**
 * Request Parameters: none
 * Request Body Content: a Booking object updated to record presence of a student at the booked lecture
 * Response Body Content: none
 */
app.put("/api/recordAttendance", (req, res) => {
  bookingDao.recordAttendance(req.body).then(() => res.status(200).end())
    .catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

app.get("/api/totalAttendance", (req, res) => {
  bookingDao.getTeacherTotalAttendance(req.query.email).then((stats) => {
    res.json(stats);
  }).catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

app.get("/api/allAttendance", (req, res) => {
  bookingDao.getTotalAttendance().then((stats) => {
    res.json(stats);
  }).catch((err) => res.status(500).json({ errors: [{ msg: err }] }));
})

//-----------------------CONTACT TRACING--------------------------------------

/**
 * GET API 
 * Request parameters: string containing the person id to set as the entry point for the contact tracing
   Request body content: none
   Response body content: list of attending students for all lectures of the course
 */
app.get("/api/contact-tracing", (req, res) => {
  contactTracingDao.getContactTracingByPersonId(req.query.personId).then((students) => {
    let empty = [];
    if (students === undefined) {
      res.json(empty)
    }
    res.json(students);
  })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: "Error while calculating contact tracing" }],
      });
    });
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
