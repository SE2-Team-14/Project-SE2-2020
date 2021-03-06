import Course from './course';
import Lecture from './lecture';
import Person from './Person';
import Classroom from './classroom';
import Booking from './booking';
import WaitingList from './waiting_list';
import Schedule from './schedule_update';

const baseURL = "http://localhost:3001/api";



//-----------------------AUTHENTICATION---------------------------

/**
 * Has no corresponding function in server.js
 * To be removed?
 */
async function isAuthenticated() {
    let url = "/user";
    return await fetchMethod("GET", baseURL + url);
}

/**
 * Checks whether the inserted user information is present in the database to allow login or not
 * @param user a Person object containing email and password inserted at login phase
 */
async function login(user) {
    return fetchMethodAndResolveResponse("POST", baseURL + "/login", user);
}
/**
 * Returns a Person object containing name and surname required
 * @param email a string containing the email of a logged in user whose name and surname are needed
 */
async function getPersonName(email) {
    let url = "/name?email=" + email;
    return await fetchMethod("GET", baseURL + url);
}

//--------------------------------------LOADING DATA-------------------------------------

/**
 * Loads into the system the list of all students stored in a CSV file
 */
async function fileLoader(fileData, fileType) {
    const url = baseURL;
    return fetchMethodAndResolveResponse("POST", `${url}/data-loader`, { fileData: fileData, fileType: fileType });
}

async function modifySchedule(courseId, dayOfWeek, schedule, oldStart) {
    const url = baseURL;
    return fetchMethod("POST", `${url}/modifySchedule`, { courseId: courseId, dayOfWeek: dayOfWeek, schedule: schedule, oldStart: oldStart });
}

async function getSchedule() {
    const url = baseURL + '/getSchedule';
    return await fetchMethod("GET", url, (s) => new Schedule(s.courseId, s.classroom, s.dayOfWeek, s.numberOfSeats, s.startingTime, s.endingTime));
}

async function getScheduleByCourseId(id) {
    const url = baseURL + "/getScheduleByCourseId?id=" + id;
    return await fetchMethod("GET", url);
}

//--------------------------------------LECTURES-------------------------------------
/**
 * Returns a Lecture object with the identifier equal to the one in input
 * @param lectureId an integer corresponding to the one of the requested lecture
 */
async function getLectureById(lectureId) {
    const url = baseURL + '/getLectureById';
    return await fetchMethod("GET", `${url}/${lectureId}`);
}

/**
 * Returns a list of Lecture objects containing all future lectures for courses the student is enrolled in
 * @param email a string containing the email of the student whose future lectures are required
 */
async function getLecturesList(id) {
    const url = baseURL + '/student-home';
    return await fetchMethod("GET", `${url}/${id}/bookable-lectures`, (l) => new Lecture(l.lectureId, l.courseId, l.teacherId, l.date, l.startingTime, l.endingTime, l.inPresence, l.classroomId, l.numberOfSeats));
}

async function getAllLecturesList() {
    const url = baseURL + '/getAllLectures';
    return await fetchMethod("GET", `${url}`, (l) => new Lecture(l.lectureId, l.courseId, l.teacherId, l.date, l.startingTime, l.endingTime, l.inPresence, l.classroomId, l.numberOfSeats));
}
/**
 * Returns a list of Lecture objects containing all future lectures for courses the student is enrolled in
 * @param email a string containing the email of the student whose future lectures are required
 */
async function getWeekLecturesList(id) {
    const url = baseURL + '/student-home';
    return await fetchMethod("GET", `${url}/${id}/week-lectures`, (l) => new Lecture(l.lectureId, l.courseId, l.teacherId, l.date, l.startingTime, l.endingTime, l.inPresence, l.classroomId, l.numberOfSeats));
}

async function getWeekTeacherLectureList(id) {
    const url = baseURL + '/teacher-home';
    return await fetchMethod("GET", `${url}/${id}/week-teacher-lectures`, (l) => new Lecture(l.lectureId, l.courseId, l.teacherId, l.date, l.startingTime, l.endingTime, l.inPresence, l.classroomId, l.numberOfSeats));
}

async function modifyByDate(startingDate, endingDate) {
    const url = baseURL + '/modifySchedule-by-date';
    return await fetchMethod("POST", `${url}`, { startingDate: startingDate, endingDate: endingDate });
}

/**
 * Returns a list of Lecture items containing all future lectures taught by a teacher
 * @param id a string containing the identifier of the teacher whose future lectures are required
 */
async function getTeacherLecturesList(id) {
    const url = baseURL + '/getTeacherLectures';
    return await fetchMethod("GET", `${url}/${id}`, (l) => new Lecture(l.lectureId, l.courseId, l.teacherId, l.date, l.startingTime, l.endingTime, l.inPresence, l.classroomId, l.numberOfSeats));
}

/**
 * Updates information about an already registered lecture after some action (booking of a new seat, cancellation of a booking, change of type)
 * @param lecture a Lecture object containing the updated information of the lecture
 */
async function updateLecture(lecture) {
    const url = baseURL;
    return fetchMethod("PUT", `${url}/lectures`, lecture);
}

async function modifyLecture(lecture) {
    const url = baseURL;
    return fetchMethod("PUT", `${url}/support-officer-home/lectures`, lecture);
}

/**
 * Returns all past lectures of a course, ordered by date of the lecture
 * @param course a string containing the name of the course whose lectures are required
 */
async function getPastLectures(course, teacher, role, name, surname) {
    let url = "/pastLectures?course=" + course + "&teacher=" + teacher + "&role=" + role + "&name=" + name + "&surname=" + surname;
    return await fetchMethod("GET", baseURL + url);
}

/**
 * Deletes an existing lecture from the booking system after a teacher has decided to do it.
 * @param lecture a Lecture object containing information about the lecture that is to be deleted
 */
async function deleteLecture(lecture) {
    const url = baseURL + '/teacher-home';
    return fetchMethod("DELETE", `${url}/delete-lecture`, { lecture: lecture });
}

/**
 * Returns a Lecture object corresponding to the lecture taking place at the current time
 * @param teacherId an Integer corresponding to the identifier of the teacher that wants to get the lecture taking place at the current time
 */
async function getCurrentLecture(teacherId) {
    const url = "/currentLecture?teacherId=" + teacherId;
    return await fetchMethod("GET", baseURL + url);
}

/**
 * Changes the lessons for the courses contained in an array from in presence to virtual
 * @param courses is an array containing course ids 
 */
async function updateBookableLecture(courses) {
    const url = baseURL;
    return fetchMethod("PUT", `${url}/modifyLectures`, { courses: courses });
}

//------------------CANCELLED LECTURES------------------

/**
 * Inserts a new cancelled lecture in the appropriate table in the database after a teacher chose to delete a lecture
 * @param lecture a Lecture object containing information about the newly deleted lecture
 */
async function addCancelledLecture(lecture) {
    const url = baseURL + '/teacher-home';
    return fetchMethod("POST", `${url}/add-cancelled-lecture`, { lecture: lecture });
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
    const url = baseURL + '/bookings';
    return fetchMethod("POST", url, {
        booking: booking,
        studentName: studentName,
        courseName: courseName,
        date: date,
        startingTime: startingTime,
        recipient: recipient,
    });
}

/**
 * Deletes an existing booking
 * @param studentId a string containing the identifier of the student that wishes to delete the booking
 * @param lectureId an integer corresponding to the identifier of the lecture associated with the booking to delete
 */
async function deleteBooking(studentId, lectureId) {
    const url = baseURL + '/student-home';
    return fetchMethod("DELETE", `${url}/delete-book`, { studentId: studentId, lectureId: lectureId });
}

/**
 * Deletes all bookings for a given lecture. Done when a teacher chooses to delete a lecture or change its type to virtual
 * @param lectureId an integer corresponding to the identifier of the lecture whose bookings are to be deleted
 */
async function deleteBookingByTeacher(lectureId) {
    let url = baseURL + '/teacher-home/deleteBookingByTeacher';
    return fetchMethod("DELETE", url, { lectureId: lectureId });
}

/**
 * Returns a list of all bookings existing in the database
 */
async function getAllBookings() {
    const url = baseURL + '/getAllBookings';
    return await fetchMethod("GET", `${url}`, (b) => new Booking(b.studentId, b.lectureId, b.date, b.startingTime, b.month, b.week));
}

/**
 * Returns all bookings for future lectures made by a student
 * @param studentId a string containing the identifier of the student whose bookings are required
 */
async function getBookings(studentId) {
    const url = baseURL + '/getBookings';
    return await fetchMethod("GET", `${url}/${studentId}`, (b) => new Booking(b.studentId, b.lectureId, b.date, b.startingTime, b.month, b.week));
}

/**
 * Returns a list of bookings made for a lecture taking place at the current time
 * @param lectureId an Integer containing the identifier of the lecture a teacher wants to have booked students of 
 */
async function getBookingsOfLecture(lectureId) {
    const url = "/bookingsOfLecture?id=" + lectureId;
    return await fetchMethod("GET", baseURL + url);
}

/**
 * Records the presence of a student that booked for a specific lecture
 * @param booking a Booking object containing identifier of booked lecture and student, updated with presence recorded
 */
async function recordAttendance(booking) {
    return await fetchMethod("PUT", `${baseURL}/recordAttendance`, booking)
}

/**
 * Returns an array containing all courses of a teacher and the total amount of registered presences for each course
 * @param email a string containing the email of the teacher that wants to have statistics about attendance at all his courses 
 */
async function getTeacherTotalAttendance(email) {
    const url = "/totalAttendance?email=" + email;
    return await fetchMethod("GET", baseURL + url);
}

/**
 * Returns an array containing all courses and the total amount of registered presences for each course
 */
async function getTotalAttendance() {
    const url = "/allAttendance";
    return await fetchMethod("GET", baseURL + url);
}

//---------------------------CANCELLED BOOKING----------------------------

/**
 * Inserts a new cancelled booking in the database, after a student chooses to delete his booked seat
 * @param studentId a string containing the identifier of the student that wishes to delete a booked seat
 * @param lectureId an integer corresponding to the identifier of the lecture associated with the booking to delete
 */
async function addCancelledBooking(studentId, lectureId) {
    const url = baseURL + '/teacher-home';
    return fetchMethod("POST", `${url}/add-cancelled-booking`, { studentId: studentId, lectureId: lectureId, });
}


//-----------------------------------TEACHER---------------------------------------

/**
 * Returns a list of Course items containing information about all courses offered by the university
 */
async function getCoursesNames() {
    const url = baseURL + '/getCourses';
    return await fetchMethod("GET", `${url}`, (c) => new Course(c.courseId, c.teacherId, c.name));
}

/**
 * Returns a list of Person objects containing information about all teachers working in the university
 */
async function getTeachers() {
    const url = baseURL + '/getTeachers';
    return await fetchMethod("GET", `${url}`, (t) => new Person(t.id, t.name, t.surname, t.role, t.email, t.password));

}


//---------------------------CLASSROMS--------------------------------

/**
 * Returns a list of Classroom items containing information about all classrooms present in the university
 */
async function getClassrooms() {
    const url = baseURL + '/getClassrooms';
    return await fetchMethod("GET", `${url}`, (c) => new Classroom(c.classroom, c.maxNumberOfSeats));

}

/**
 * Returns a list of classrooms that already have a lecture in the day and interval specified
 * @param dayOfWeek a string containing the day in which used classrooms are being searched for 
 * @param startingTime a string containing the starting hour of the interval in which to look for used classrooms
 * @param endingTime a string containing the ending hour of the interval in which to look for used classrooms
 */
async function getFullClassrooms(dayOfWeek, startingTime, endingTime) {
    const url = "/getFullClassrooms?day=" + dayOfWeek + "&start=" + startingTime + "&end=" + endingTime;
    return await fetchMethod("GET", baseURL + url);
}

//--------------------------COURSES------------------------------

/**
 * Returns a list of all courses taught by a teacher
 * @param teacher a string containing the email of the teacher whose courses are required
 */
async function getCourses(teacher) {
    let url = "/courses?teacher=" + teacher;
    return fetchMethod("GET", baseURL + url);
}

/**
 * Returns a list of all courses present in the database
 */
async function getAllCourses() {
    let url = "/getAllCourses";
    return fetchMethod("GET", baseURL + url);
}

/**
 * Returns a list of all courses with also information about the teacher in charge of each course
 */
async function getCoursesAndTeachers() {
    let url = "/getCoursesAndTeachers";
    return fetchMethod("GET", baseURL + url);
}

/**
 * Returns a list of all courses per year
 */
async function getCoursesByYear(years) {

    let url = "/getCoursesByYear?years=" + years;
    return fetchMethod("GET", baseURL + url);
}

/**
 * Returns a list of all courses per year and semester
 */
async function getCoursesByYearAndSemester(years, semester) {
    let url = "/getCoursesByYearAndSemester?years=" + years + "&semester=" + semester;
    return fetchMethod("GET", baseURL + url);
}


//-------------------------STUDENTS----------------------------

/**
 * Returns information about all students that booked a seat for all future lectures of a course
 * @param course a string containing the name of the course whose future bookings are needed
 */
async function getBookedStudents(course) {
    let url = "/bookedStudents?course=" + course;
    return await fetchMethod("GET", baseURL + url);

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
    return await fetchMethod("GET", baseURL + url);
}

/**
 * Returns statistics about cancelled bookings of a course (in detail, amount of ancelled bookings for each lecture of the course)
 * @param course a string containing the name of the course a teacher wants to have statistics of
 */
async function getCancelledBookingsStats(course) {
    let url = "/cancelledBookings?course=" + course;
    return await fetchMethod("GET", baseURL + url);
}

/**
 * Returns statistics about total bookings made for all courses
 * @param email a string containing the email of the teacher that wants to know all bookings for all his courses
 */
async function getTeacherCoursesStatistics(email) {
    let url = "/allCoursesStatistics?teacher=" + email;
    return await fetchMethod("GET", baseURL + url);
}

/**
 * Returns statistics about total bookings made for all courses available
 * @param email a string containing the email of the teacher that wants to know all bookings for all his courses
 */
async function getAllCoursesStatistics() {
    let url = "/allCoursesStats";
    return await fetchMethod("GET", baseURL + url);
}

/**
 * Returns statistics about cancelled lectures for all courses available
 */
async function getCancelledLecturesStats() {
    let url = "/cancelledLecturesStats";
    return await fetchMethod("GET", baseURL + url);
}

//-----------------------------------WAITING LIST------------------------------------

/**
 * Inserts a student in the waiting list
 * @param studentId 
 * @param courseId
 * @param lectureId 
 */

/**
 * Returns a list of all bookings in the waiting list existing in the database
 */
async function getAllWaitingList() {
    const url = baseURL + '/getAllWaitingList';
    console.log(url);
    return await fetchMethod("GET", `${url}`, (w) => new WaitingList(w.studentId, w.lessonId, w.bookingDate, w.bookingTime));
}


async function putInWaitingList(studentId, lectureId) {
    const url = baseURL + '/student-home';
    return fetchMethod("POST", `${url}/put-in-queue`, { studentId: studentId, lectureId: lectureId, });
}

/**
 * Returns the first student in the waiting list for a specific course and lecture
 * @param courseId a string containing the id of the course 
 * @param lectureId a string containing the id of the lecture 
 */
async function getFirstStudentInWaitingList(lectureId) {
    let url = "/studentInWaitinglist?lectureId=" + lectureId;
    return await fetchMethod("GET", baseURL + url);
}

/**
 * Deletes an existing booking in the waiting list
 * @param studentId a string containing the identifier of the student that wishes to delete the booking
 * @param lectureId an integer corresponding to the identifier of the lecture associated with the booking to delete
 */
async function deleteFromWaitingList(studentId, lectureId) {
    const url = baseURL + '/student-home';
    return fetchMethod("DELETE", `${url}/delete-from-waiting-list`, { studentId: studentId, lectureId: lectureId });
}



//--------------------CONTACT TRACING-----------------------
/**
 * Returns list of stundents being in contact with te positive person since 14 days
 * @param perdsonId id of the positive person
 */
async function getContactTracingByPerson(personId) {
    let url = "/contact-tracing?personId=" + personId;
    return await fetchMethod("GET", baseURL + url);
}

//--------------------------------UTILS------------------------------


/**Simplify the execution of the fetch api for a specific method without reolving the response
 * @param method a string containig the method 'GET', 'POST', 'DELETE', 'PUT' 
 * @param URL a string containing the URL for the requested API
 * @param param the object containing the body of the post, delete, or put, or the OPTIONAL function to map the response of a GET
 * @return the response of the API
 * 
*/
async function fetchMethod(method, URL, param) {
    return _fetchMethod(false, method, URL, param)
}

/**Simplify the execution of the fetch api for a specific method and resolve the response
 * @param method a string containig the method 'GET', 'POST', 'DELETE', 'PUT' 
 * @param URL a string containing the URL for the requested API
 * @param param the object containing the body of the post, delete, or put, or the OPTIONAL function to map the response of a GET
 * @return the response of the API
 * 
*/
async function fetchMethodAndResolveResponse(method, URL, param) {
    return _fetchMethod(true, method, URL, param)
}


async function _fetchMethod(resolveResponse, method, URL, param) {
    if (method == "GET") {
        return _fetchGET(URL, param);
    }
    if (method == "POST" || method == "DELETE" || method == "PUT") {
        return new Promise((resolve, reject) => {
            fetch(URL, {
                method: method,
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(param),
            }).then((response) => {
                if (response.ok) {
                    resolve(resolveResponse ? response.json() : null);
                } else {
                    response.json()
                        .then((obj) => { reject(obj); })
                        .catch((err) => reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }));
                }
            }).catch((err) => { reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) });
        });
    }
    throw method + " is not a valid HTTP Method!";
}


/**Simplify the execution of the fetch api for the GET method
 * @param URL a string containing the URL for the requested API
 * @param mapFunction optional, if present, map the elements of the response with the passed 
 * @return the response of the API
 * 
*/
async function _fetchGET(URL, mapFunction) {
    const response = await fetch(URL);
    const responseJSON = await response.json();
    if (response.ok) {
        if (!mapFunction)
            return responseJSON;
        else
            return responseJSON.map(mapFunction);
    } else {
        let err = { status: response.status, errObj: responseJSON };
        throw err;
    }
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
    updateLecture,
    getPersonName,
    getAllBookings,
    deleteBooking,
    getPastLectures,
    getStatistics,
    getTeacherLecturesList,
    deleteLecture,
    addCancelledLecture,
    getCancelledBookingsStats,
    deleteBookingByTeacher,
    getBookings,
    getLectureById,
    addCancelledBooking,
    fileLoader,
    getFirstStudentInWaitingList,
    putInWaitingList,
    getTeacherCoursesStatistics,
    getAllCourses,
    getAllCoursesStatistics,
    getAllWaitingList,
    getCoursesAndTeachers,
    getCancelledLecturesStats,
    getWeekLecturesList,
    getWeekTeacherLectureList,
    getContactTracingByPerson,
    getCurrentLecture,
    getBookingsOfLecture,
    recordAttendance,
    getTeacherTotalAttendance,
    getTotalAttendance,
    getCoursesByYear,
    getCoursesByYearAndSemester,
    updateBookableLecture,
    deleteFromWaitingList,
    modifySchedule,
    getSchedule,
    getScheduleByCourseId,
    modifyByDate,
    getFullClassrooms,
};

export default API;
