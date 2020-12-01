import Course from './course';
import Lecture from './lecture';
import Person from './Person';
import Classroom from './classroom';
import Booking from './booking';
const baseURL = "http://localhost:3001/api";



//-----------------------AUTHENTICATION---------------------------

/**
 * Has no corresponding function in server.js
 * To be removed?
 */
async function isAuthenticated() {
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if (response.ok) {
        return userJson;
    } else {
        let err = { status: response.status, errObj: userJson };
        throw err;
    }
}

/**
 * Checks whether the inserted user information is present in the database to allow login or not
 * @param user a Person object containing email and password inserted at login phase
 */
async function login(user) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        }).then((response) => {
            if (response.ok) {
                resolve(response.json());
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
/**
 * Returns a Person object containing name and surname required
 * @param email a string containing the email of a logged in user whose name and surname are needed
 */
async function getPersonName(email) {
    let url = "/name?email=" + email;
    const response = await fetch(baseURL + url);
    const nameJson = await response.json();
    if (response.ok) {
        return nameJson;
    } else {
        let err = { status: response.status, errObj: nameJson };
        throw err;
    }
}

//--------------------------------------LECTURES-------------------------------------
/**
 * Returns a Lecture object with the identifier equal to the one in input
 * @param lectureId an integer corresponding to the one of the requested lecture
 */
async function getLectureById(lectureId) {
    const url = baseURL + '/getLectureById';
    const response = await fetch(`${url}/${lectureId}`);
    const lecturesJson = await response.json();

    if (response.ok) {
        return lecturesJson;
    }
    const err = { status: response.status, errors: lecturesJson.errors };
    throw err;
}

/**
 * Returns a list of Lecture objects containing all future lectures for courses the student is enrolled in
 * @param email a string containing the email of the student whose future lectures are required
 */
async function getLecturesList(email) {
    const url = baseURL + '/student-home';
    const response = await fetch(`${url}/${email}/bookable-lectures`);
    const lecturesJson = await response.json();

    if (response.ok) {
        return lecturesJson.map((l) => new Lecture(l.lectureId, l.courseId, l.teacherId, l.date, l.startingTime, l.endingTime, l.inPresence, l.classroomId, l.numberOfSeats));
    }
    const err = { status: response.status, errors: lecturesJson.errors };
    throw err;
}

/**
 * Returns a list of Lecture items containing all future lectures taught by a teacher
 * @param id a string containing the identifier of the teacher whose future lectures are required
 */
async function getTeacherLecturesList(id) {
    const url = baseURL + '/getTeacherLectures';
    const response = await fetch(`${url}/${id}`);
    const lecturesJson = await response.json();

    if (response.ok) {
        return lecturesJson.map((l) => new Lecture(l.lectureId, l.courseId, l.teacherId, l.date, l.startingTime, l.endingTime, l.inPresence, l.classroomId, l.numberOfSeats));
    }
    const err = { status: response.status, errors: lecturesJson.errors };
    throw err;
}

/**
 * Updates information about an already registered lecture after some action (booking of a new seat, cancellation of a booking, change of type)
 * @param lecture a Lecture object containing the updated information of the lecture
 */
async function updateLecture(lecture) {
    const url = baseURL;

    return new Promise((resolve, reject) => {
        fetch(`${url}/lectures`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(lecture),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }));
            }
        }).catch((err) => { reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) });
    });
}

/*
async function decreaseSeats(lecture) {
    const url = baseURL + '/student-home';

    return new Promise((resolve, reject) => {
        fetch(`${url}/decrease-seats`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(lecture),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }));
            }
        }).catch((err) => { reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) });
    });
}*/

/**
 * Returns all past lectures of a course, ordered by date of the lecture
 * @param course a string containing the name of the course whose lectures are required
 */
async function getPastLectures(course) {
    let url = "/pastLectures?course=" + course;
    const response = await fetch(baseURL + url);
    const lectureJson = await response.json();
    if (response.ok) {
        return lectureJson;
    } else {
        let err = { status: response.status, errObj: lectureJson };
        throw err;
    }
}

/**
 * Deletes an existing lecture from the booking system after a teacher has decided to do it.
 * @param lecture a Lecture object containing information about the lecture that is to be deleted
 */
async function deleteLecture(lecture) {
    const url = baseURL + '/teacher-home';

    return new Promise((resolve, reject) => {
        fetch(`${url}/delete-lecture`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                lecture: lecture
            }),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }));
            }
        }).catch((err) => { reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) });
    });
}


//------------------CANCELLED LECTURES------------------

/**
 * Inserts a new cancelled lecture in the appropriate table in the database after a teacher chose to delete a lecture
 * @param lecture a Lecture object containing information about the newly deleted lecture
 */
async function addCancelledLecture(lecture) {
    const url = baseURL + '/teacher-home';

    return new Promise((resolve, reject) => {
        fetch(`${url}/add-cancelled-lecture`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                lecture: lecture
            }),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }));
            }
        }).catch((err) => { reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) });
    });
}



//-----------------------------------BOOKING------------------------------------

/**
 * Books a seat for a student at a given lecture
 * @param booking a Booking object containing information about the booking
 * @param studentName a string containing the name of the student that booked the lecture
 * @param courseName a string containing the name of the course related to the lecture
 * @param date a string containing the date in which the lecture will take place, in format DD/MM/YYYY
 * @param startingTime a string containing the time at which the lecture will start, in format HH:MM
 * @param recipient a string containing the email of the student that booked the lecture, used to send him a notification after booking has been saved correctly
 */
async function bookSeat(booking, studentName, courseName, date, startingTime, recipient) {
    const url = baseURL + '/student-home';

    return new Promise((resolve, reject) => {
        fetch(`${url}/book`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                booking: booking,
                studentName: studentName,
                courseName: courseName,
                date: date,
                startingTime: startingTime,
                recipient: recipient,
            }),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }));
            }
        }).catch((err) => { reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) });
    });
}

/**
 * Deletes an existing booking
 * @param studentId a string containing the identifier of the student that wishes to delete the booking
 * @param lectureId an integer corresponding to the identifier of the lecture associated with the booking to delete
 */
async function deleteBooking(studentId, lectureId) {
    const url = baseURL + '/student-home';

    return new Promise((resolve, reject) => {
        fetch(`${url}/delete-book`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                studentId: studentId,
                lectureId: lectureId
            }),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }));
            }
        }).catch((err) => { reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) });
    });
}

/**
 * Deletes all bookings for a given lecture. Done when a teacher chooses to delete a lecture or change its type to virtual
 * @param lectureId an integer corresponding to the identifier of the lecture whose bookings are to be deleted
 */
async function deleteBookingByTeacher(lectureId) {
    let url = baseURL + '/teacher-home';
    return new Promise((resolve, reject) => {
        fetch(`${url}/deleteBookingByTeacher`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                lectureId: lectureId
            }),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }));
            }
        }).catch((err) => { reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) });
    });
}

/**
 * Returns a list of all bookings existing in the database
 */
async function getAllBookings() {
    const url = baseURL + '/getAllBookings';
    const response = await fetch(`${url}`);
    const bookingsJson = await response.json();

    if (response.ok) {
        return bookingsJson.map((b) => new Booking(b.studentId, b.lectureId, b.date, b.startingTime, b.month, b.week));
    }
    const err = { status: response.status, errors: bookingsJson.errors };
    throw err;
}

/**
 * Returns all bookings for future lectures made by a student
 * @param studentId a string containing the identifier of the student whose bookings are required
 */
async function getBookings(studentId) {
    const url = baseURL + '/getBookings';
    const response = await fetch(`${url}/${studentId}`);
    const bookingsJson = await response.json();

    if (response.ok) {
        return bookingsJson.map((b) => new Booking(b.studentId, b.lectureId, b.date, b.startingTime, b.month, b.week));
    } else {
        const err = { status: response.status, errors: bookingsJson.errors };
        throw err;
    }

}


//---------------------------CANCELLED BOOKING----------------------------

/**
 * Inserts a new cancelled booking in the database, after a student chooses to delete his booked seat
 * @param studentId a string containing the identifier of the student that wishes to delete a booked seat
 * @param lectureId an integer corresponding to the identifier of the lecture associated with the booking to delete
 */
async function addCancelledBooking(studentId, lectureId) {
    const url = baseURL + '/teacher-home';

    return new Promise((resolve, reject) => {
        fetch(`${url}/add-cancelled-booking`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                studentId: studentId,
                lectureId: lectureId,
            }),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }));
            }
        }).catch((err) => { reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) });
    });
}


//-----------------------------------TEACHER---------------------------------------

/**
 * Returns a list of Course items containing information about all courses offered by the university
 */
async function getCoursesNames() {
    const url = baseURL + '/getCourses';
    const response = await fetch(`${url}`);
    const coursesJson = await response.json();

    if (response.ok) {
        return coursesJson.map((c) => new Course(c.courseId, c.teacherId, c.name));
    }
    const err = { status: response.status, errors: coursesJson.errors };
    throw err;
}

/**
 * Returns a list of Person objects containing information about all teachers working in the university
 */
async function getTeachers() {
    const url = baseURL + '/getTeachers';
    const response = await fetch(`${url}`);
    const teachersJson = await response.json();

    if (response.ok) {
        return teachersJson.map((t) => new Person(t.id, t.name, t.surname, t.role, t.email, t.password));
    }
    const err = { status: response.status, errors: teachersJson.errors };
    throw err;
}


//---------------------------CLASSROMS--------------------------------

/**
 * Returns a list of Classroom items containing information about all classrooms present in the university
 */
async function getClassrooms() {
    const url = baseURL + '/getClassrooms';
    const response = await fetch(`${url}`);
    const classroomsJson = await response.json();

    if (response.ok) {
        return classroomsJson.map((c) => new Classroom(c.classroom, c.maxNumberOfSeats));
    }
    const err = { status: response.status, errors: classroomsJson.errors };
    throw err;
}



//--------------------------COURSES------------------------------

/**
 * Returns a list of all courses taught by a teacher
 * @param teacher a string containing the email of the teacher whose courses are required
 */
async function getCourses(teacher) {
    let url = "/courses?teacher=" + teacher;
    const response = await fetch(baseURL + url);
    const coursesJson = await response.json();
    if (response.ok) {
        return coursesJson;
    } else {
        let err = { status: response.status, errObj: coursesJson };
        throw err;
    }
}


//-------------------------STUDENTS----------------------------

/**
 * Returns information about all students that booked a seat for all future lectures of a course
 * @param course a string containing the name of the course whose future bookings are needed
 */
async function getBookedStudents(course) {
    let url = "/bookedStudents?course=" + course;
    const response = await fetch(baseURL + url);
    const enrollJson = await response.json();
    if (response.ok) {
        return enrollJson;
    } else {
        let err = { status: response.status, errObj: enrollJson };
        throw err;
    }
}



//----------------------STATISTICS-----------------------

/**
 * Returns statistics about past bookings of a course, depending on the chosen mode (possible values are lecture, week, month and total)
 * @param date a string present only if the mode is lecture, it contains the lecture for which a teacher wants to know bookings about in format DD/MM/YYYY; it's equal to null if mode has another value
 * @param mode a string containing the mode a teacher wants to have statistics based on
 * @param course a string containing the name of the course a teacher wants to have statistics of
 */
async function getStatistics(date, mode, course) {
    let url = "/statistics?date=" + date + "&mode=" + mode + "&course=" + course;
    const response = await fetch(baseURL + url);
    const statsJson = await response.json();
    if (response.ok) {
        return statsJson;
    } else {
        let err = { status: response.status, errObj: statsJson };
        throw err;
    }
}

/**
 * Returns statistics about cancelled bookings of a course (in detail, amount of ancelled bookings for each lecture of the course)
 * @param course a string containing the name of the course a teacher wants to have statistics of
 */
async function getCancelledBookingsStats(course) {
    let url = "/cancelledBookings?course=" + course;
    const response = await fetch(baseURL + url);
    const statsJson = await response.json();
    if (response.ok) {
        return statsJson;
    } else {
        let err = { status: response.status, errObj: statsJson };
        throw err;
    }
}

/*
//change type of lecture from presence to virtual
async function changeLectureType(lecture) {
    const url = baseURL + '/teacher-home';

    return new Promise((resolve, reject) => {
        fetch(`${url}/change-type`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(lecture),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }));
            }
        }).catch((err) => { reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) });
    });
}
*/



const API = {
    isAuthenticated,
    login,
    getLecturesList,
    getCourses,
    getBookedStudents,
    getCoursesNames,
    getTeachers,
    getClassrooms,
    bookSeat,
    updateLecture,
    getPersonName,
    getAllBookings,
    deleteBooking,
    getPastLectures,
    getStatistics,
    getTeacherLecturesList,
    //changeLectureType,
    deleteLecture,
    addCancelledLecture,
    getCancelledBookingsStats,
    deleteBookingByTeacher,
    getBookings,
    getLectureById,
    addCancelledBooking,
};

export default API;
