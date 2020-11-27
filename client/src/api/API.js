import Course from './course';
import Lecture from './lecture';
import Person from './Person';
import Classroom from './classroom';
import Booking from './booking';
const baseURL = "http://localhost:3001/api";

//-----------------------AUTHENTICATION---------------------------

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

//API to book a seat
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
async function increaseSeats(lecture) {
    const url = baseURL + '/student-home';

    return new Promise((resolve, reject) => {
        fetch(`${url}/increase-seats`, {
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
}

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

async function getAllBookings() {
    const url = baseURL + '/getAllBookings';
    const response = await fetch(`${url}`);
    const bookingsJson = await response.json();

    if (response.ok) {
        return bookingsJson.map((b) => new Booking(b.studentId, b.lectureId, b.date, b.startingTime));
    }
    const err = { status: response.status, errors: bookingsJson.errors };
    throw err;
}

//returns all courses taught by a teacher
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

//gets all students enrolled for lessons in a course
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

//gets name and surname of a registered user
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

//delete lecture 
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

async function deleteBookingByTeacher(lectureId){
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
    increaseSeats,
    decreaseSeats,
    getPersonName,
    getAllBookings,
    deleteBooking,
    getPastLectures,
    getStatistics,
    getTeacherLecturesList,
    changeLectureType,
    deleteLecture,
    addCancelledLecture,
    getCancelledBookingsStats,
    deleteBookingByTeacher,
};

export default API;
