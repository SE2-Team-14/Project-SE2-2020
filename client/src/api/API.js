import Lecture from './lecture';
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
async function getLecturesList(studentId) {
    const url = base + '/home-student';
    const response = await fetch(`${url}/${studentId}/bookable-lectures`);
    const lecturesJson = await response.json();

    if (response.ok) {
        return lecturesJson.map((l) => new Lecture(l.lectureId, l.courseId, l.teacherId, l.date, l.startingTime, l.endingTime, l.inPresence, l.classroomId, l.numberOfSeats));
    }
    const err = { status: response.status, errors: lecturesJson.errors };
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

const API = { isAuthenticated, login, getLecturesList, getCourses, getEnrollments, };

export default API;
