[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=SE2-Team-14_Project-SE2-2020&metric=security_rating)](https://sonarcloud.io/dashboard?id=SE2-Team-14_Project-SE2-2020)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=SE2-Team-14_Project-SE2-2020&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=SE2-Team-14_Project-SE2-2020) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=SE2-Team-14_Project-SE2-2020&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=SE2-Team-14_Project-SE2-2020)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=SE2-Team-14_Project-SE2-2020&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=SE2-Team-14_Project-SE2-2020) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=SE2-Team-14_Project-SE2-2020&metric=bugs)](https://sonarcloud.io/dashboard?id=SE2-Team-14_Project-SE2-2020) [![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=SE2-Team-14_Project-SE2-2020&metric=sqale_index)](https://sonarcloud.io/dashboard?id=SE2-Team-14_Project-SE2-2020)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=SE2-Team-14_Project-SE2-2020&metric=ncloc)](https://sonarcloud.io/dashboard?id=SE2-Team-14_Project-SE2-2020) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=SE2-Team-14_Project-SE2-2020&metric=coverage)](https://sonarcloud.io/dashboard?id=SE2-Team-14_Project-SE2-2020) [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=SE2-Team-14_Project-SE2-2020&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=SE2-Team-14_Project-SE2-2020) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=SE2-Team-14_Project-SE2-2020&metric=code_smells)](https://sonarcloud.io/dashboard?id=SE2-Team-14_Project-SE2-2020)



## Use Docker:


* To build and run, simply run "build-run.sh" in the root directory:
  $bash build-run.sh

* To push the result on the docker-hub repository use "docker-push.sh" in the root directory:
  $bash docker-push.sh
  
### Release 2 (final version)

* To pull the server image: 
  sudo docker pull team14se2/pulsebs:serverRelease2
 
* To pull the client image: 
  sudo docker pull team14se2/pulsebs:clientRelease2

* To run the server image:
  sudo docker run -p 3001:3001 team14se2/pulsebs:serverRelease2
 
 * To run the client image:
  sudo docker run -it --rm -v ${PWD}:/client -v /src/node_modules -p 3000:3000 -e CHOKIDAR_USEPOLLING=true team14se2/pulsebs:clientRelease2

### Release 1

* To pull the server image: 
  sudo docker pull team14se2/pulsebs:serverRelease1
 
* To pull the client image: 
  sudo docker pull team14se2/pulsebs:clientRelease1

* To run the server image:
  sudo docker run -p 3001:3001 team14se2/pulsebs:serverRelease1
 
 * To run the client image:
  sudo docker run -it --rm -v ${PWD}:/client -v /src/node_modules -p 3000:3000 -e CHOKIDAR_USEPOLLING=true team14se2/pulsebs:clientRelease1


## Example Users:

* e-mail password (Role)

* Ines.Beneventi@politu.it  team14 (Teacher)

* s900000@students.politu.it team14 (Student)

* danieleaurigemma@politu.it team14 (Manager)

* gaetanoepiro@outlook.it team14 (SupportOfficer)


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
- GET `/api/getTeacherLectures/:id`
  - request parameters: empty
  - request body: empty
  - response body: an array of objects Lecture of the teacher with id = id
- POST `/api/bookings`
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

- GET `/api/contacttracing`
  - request query parameters: personId, the positive person to be tracked
  - request body: empty
  - response body: a list of string containing information about people being in contact with the positive person
