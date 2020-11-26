## Use Docker:


* To build and run, simply run "build-run.sh" in the root directory:
  $bash build-run.sh

* To push the result on the docker-hub repository use "docker-push.sh" in the root directory:
  $bash docker-push.sh

## REST API server

- POST `/api/login`
  - request parameters: vuoto
  - request body: object that contains the information of the credentials (username, password)
  - response body: object that contains the name of the user, his id, email and role in the University
  - error: if wrong credentiale
- GET `/api/student-home/:email/bookable-lectures`
  - request parameters: empty
  - request body: empty
  - response body: an array of objects Lecture 
- GET `/api/courses`
  - request parameters: the email of the teacher
  - request body: empty
  - response body: an array of objects Course 
- GET `/api/enrollment`
  - request parameters: the id of the course
  - request body: empty
  - response body: an array of objects Person 
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
- GET `/api/name`
  - request parameters: the email of the teacher
  - request body: empty
  - response body: the entire object Person with email of the request
- GET `/api/pastLectures`
  - request parameters: the id of the course
  - request body: empty
  - response body: an array with date, starting time and ending time of the lectures of the course
- GET `/api/statistics`
  - request parameters: the date, the mode and the courseId
  - request body: empty
  - response body: the statistics of the course
- GET `/api/cancelledBookings`
  - request parameters: the courseId
  - request body: empty
  - response body: the statistics of the course
- POST `/api/student-home/book`
  - request parameters: empty
  - request body: the new object Booking and the recipient
  - response body: empty
- POST `/api/teacher-home/add-cancelled-lecture`
  - request parameters: empty
  - request body: the new object CancelledLectures 
  - response body: the id of the new object
- PUT `/api/student-home/increase-seats`
  - request parameters: the lecture to update
  - request body: the lecture to update
  - response body: empty
- PUT `/api/student-home/decrease-seats`
  - request parameters: empty
  - request body: the lecture to update
  - response body: empty
- PUT `/api/teacher-home/change-type`
  - request parameters: empty
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