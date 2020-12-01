## Use Docker:


* To build and run, simply run "build-run.sh" in the root directory:
  $bash build-run.sh

* To push the result on the docker-hub repository use "docker-push.sh" in the root directory:
  $bash docker-push.sh


## List of all used APIs

- POST `/api/`
  - Request Parameters: ...
  - Request Body Content: ...
  - Response Body Content: ...
- GET `/api/courses`
  - Request Parameters: string containing the email of the teacher for which one wants to know the taught courses
  - Request Body Content: none
  - Response Body Content: list of courses taught by said teacher
- GET `/api/bookedStudents`
  - Request Parameters: string containing the name of the course for which a teacher wants to have a list of all booked students
  - Request Body Content: none
  - Response Body Content: list of booked students for all future lectures of the course (including lectures taking place in the present day)
- GET `/api/name`
  - Request Parameters: string containing the email corresponding to the person one wants to have the name and surname of
  - Request Body Content: none
  - Response Body Content: information about the person (name, surname, email)
- GET `/api/statistics`
  - Request Parameters: 
    - date: string containing the date of a lecture a teacher wants to have statistics about; set to null if the parameter mode is not equal to "lecture"
    - mode: string containing the mode of statistics a teacher wants to have (days for a single lecture, divided by week, divided by month, total bookings divided by lecture)
    - course: string containing the name of the course for which the teacher wants to have statistics
  - Request Body Content: none
  - Response Body Content: array containing those statistics
- GET `/api/cancelledBookings`
  - Request Parameters: string containing the name of the course for which a teacher wants to have statistics about cancelled bookings
  - Request Body Content: none
  - Response Body Content: array containing those statistics
- POST `/api/login`
  - request parameters: vuoto
  - request body: object that contains the information of the credentials (username, password)
  - response body: object that contains the name of the user, his id, email and role in the University
  - error: if wrong credentiale
- GET `/api/student-home/:email/bookable-lectures`
  - request parameters: empty
  - request body: empty
  - response body: an array of objects Lecture 
- GET `/api/getCourses`
  - request parameters: empty
  - request body: empty
  - response body: an array of objects Course 
- GET `/api/getTeachers`
  - request parameters: empty
  - request body: empty
  - response body: an array of objects Person
- GET `/api/getClassrooms`
  - request parameters: empty
  - request body: empty
  - response body: an array of objects Classroom
- GET `/api/getAllBookings`
  - request parameters: empty
  - request body: empty
  - response body: an array of objects Booking
- GET `/api//api/getTeacherLectures/:id`
  - request parameters: empty
  - request body: empty
  - response body: an array of objects Lecture of the teacher with id = id
- POST `/api/student-home/book`
  - request parameters: empty
  - request body: the new object Booking and the recipient
  - response body: empty
- POST `/api/teacher-home/add-cancelled-lecture`
  - request parameters: empty
  - request body: the new object CancelledLectures 
  - response body: the id of the new object
- PUT `/api/lectures`
  - request parameters: empty'
  - request body: the lecture to update
  - response body: empty
- DELETE `/api/teacher-home/delete-lecture`
  - request parameters: empty
  - request body: the lecture to delete
  - response body: empty
- DELETE `/api/teacher-home/delete-lecture`
  - request parameters: empty
  - request body: the lectureId of the lecture and the studentId of the student that want unbook the lecture with id = lectureId
  - response body: empty