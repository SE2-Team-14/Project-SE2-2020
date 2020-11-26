-Use Docker:
============

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
  - Response Body Content: list of booked students for all lectures of the course
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