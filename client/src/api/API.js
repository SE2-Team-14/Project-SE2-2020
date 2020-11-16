import Course from './course';
import Lecture from './lecture';
import Person from './Person';
import Classroom from './classroom';
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


//---------------------OFFICER ACCOUNT CREATION---------------------

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

//API for book a seat
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

async function getEnrollments(course) {
    let url = "/enrollment?course=" + course;
    const response = await fetch(baseURL + url);
    const enrollJson = await response.json();
    if (response.ok) {
        return enrollJson;
    } else {
        let err = { status: response.status, errObj: enrollJson };
        throw err;
    }
}

const API = { isAuthenticated, login, getLecturesList, getCourses, getEnrollments, getCoursesNames, getTeachers, getClassrooms };

export default API;
