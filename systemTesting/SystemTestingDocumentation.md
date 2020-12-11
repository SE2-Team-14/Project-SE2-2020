# System Testing Document

Authors:
- Team 14

# Contents
In this document you can find the documentation about our system testing. For each test we will describe each step necessary to complete the tested functionality, also attaching various summary screenshots. 

- [List of stories](#list-of-stories)
	- [Story 1](#story-1)
	- [Story 2](#story-2)
	- [Story 3](#story-3)
	- [Story 4](#story-4)
	- [Story 5](#story-5)
	- [Story 6](#story-6)
	- [Story 7](#story-7)
	- [Story 8](#story-8)
	- [Story 9](#story-9)
	- [Story 10](#story-10)
	- [Story 11](#story-11)
	- [Story 12](#story-12)
	- [Story 13](#story-13)
	- [Story 14](#story-14)
	- [Story 15](#story-15)
	- [Story 16](#story-16)


# List of stories

## Story 1 
##### As a student I want to book a seat for one of my lectures so that I can attend it.
### Test 1 (A student book an available lecture)
- Like a student I need to put my credentials in the login form and then press the button Login. 

![LoginForm](./testImage/StudentScreen/StudentLogin.JPG)

- After the login success, I can see my home page with two links in the header.

![StudentHP](./testImage/StudentScreen/StudentHP.JPG)

- If I click on Bookable Lectures I can see the list of the bookable lectures. 

![BookableLectures](./testImage/StudentScreen/BookableLecture.JPG)

- For book a lecture I need to press the button Book of the lecture that I'm interest. After the click, a modal is shown with a Confirm.

![ModalConfirmBook](./testImage/StudentScreen/ModalConfirmBook.JPG)

- If I click Yes, another modal is shown with the confirm message. 

![ModalSuccessBook](./testImage/StudentScreen/ModalSuccessBooking.JPG)

- Now the list of available lectures is update with the booked lectures.

![NewBookableLectures](./testImage/StudentScreen/BookableLectureAfterBooking.JPG)

## Story 2 
##### As a teacher I want to get notified of the number of students attending my next lecture so that I am informed.
### Test 2 (A teacher receive a mail )
- As a teacher I receive a mail at 23:00 with the number of students booked for my next lecture.

![MailNumberStudents](./testImage/TeacherScreen/MailNumberStudents.jpg)

## Story 3 
##### As a teacher I want to access the list of students booked for my lectures so that I am informed.
### Test 3 (A teacher access to list of student booked but no student available)
- Like a teacher I need to put my credentials in the login form and then press the button Login.

![LoginForm](./testImage/TeacherScreen/TeacherLogin.JPG)

- After the login success, I can see my home page with three links in the header

![TeacherHP](./testImage/TeacherScreen/TeacherHP.JPG)

- If I click on Booked Lectures I can see the list of the students booked for my next lectures. In this case, there are zero bookings.

![BookedLectureNoStudents](./testImage/TeacherScreen/BookedLectureWithoutBookings.JPG)

### Test 4 (A teacher access to list of student booked)
- Like a teacher I need to put my credentials in the login form and then press the button Login.

![LoginForm](./testImage/TeacherScreen/TeacherLogin.JPG)

- After the login success, I can see my home page with three links in the header

![TeacherHP](./testImage/TeacherScreen/TeacherHP.JPG)

- If I click on Booked Lectures I can see the list of the students booked for my next lectures. In this case, there are some bookings.

![BookedLecture](./testImage/TeacherScreen/BookedLecture.JPG)

## Story 4 
###### As a student I want to get an email confirmation of my booking so that I am informed.
### Test 5 (A student book an available lecture and receive a mail confirmation)
- Like a student I need to put my credentials in the login form and then press the button Login. 

![LoginForm](./testImage/StudentScreen/StudentLogin.JPG)

- After the login success, I can see my home page with two links in the header.

![StudentHP](./testImage/StudentScreen/StudentHP.JPG)

- If I click on Bookable Lectures I can see the list of the bookable lectures. 

![BookableLectures](./testImage/StudentScreen/BookableLecture.JPG)

- For book a lecture I need to press the button Book of the lecture that I'm interest. After the click, a modal is shown with a Confirm.

![ModalConfirmBook](./testImage/StudentScreen/ModalConfirmBook.JPG)

- If I click Yes, another modal is shown with the confirm message and a mail is sent. 

![ModalSuccessBook](./testImage/StudentScreen/ModalSuccessBooking.JPG)

![Email](./testImage/StudentScreen/EmailBookingConfirm.JPG)

- Now the list of available lectures is update with the booked lectures.

![NewBookableLectures](./testImage/StudentScreen/BookableLectureAfterBooking.JPG)
## Story 5 
###### As a student I want to cancel my booking so that I am free.
### Test 6 (A student delete a booked lecture)
- Like a student I need to put my credentials in the login form and then press the button Login. 

![LoginForm](./testImage/StudentScreen/StudentLogin.JPG)

- After the login success, I can see my home page with two links in the header.

![StudentHP](./testImage/StudentScreen/StudentHP.JPG)

- If I click on Bookable Lectures I can see the list of the bookable lectures. 

![BookableLectures](./testImage/StudentScreen/BookableLectureAfterBooking.JPG)

- For delete a lecture I need to press the button Delete of the lecture that I'm interest. After the click, a modal is shown with a Confirm.

![ModalConfirmDelete](./testImage/StudentScreen/ModalConfirmDelete.JPG)

- If I click Yes, another modal is shown with the confirm message. 

![ModalSuccessBook](./testImage/StudentScreen/ModalSuccessDelete.JPG)

- Now the list of available lectures is update with the unbooked lectures.

![NewBookableLectures](./testImage/StudentScreen/BookableLecture.JPG)
## Story 6 
###### As a student I want to access a calendar with all my bookings for the upcoming weeks.
### Test 7 (A student access a calendar without booked lessons)
- Like a student I need to put my credentials in the login form and then press the button Login. 

![LoginForm](./testImage/StudentScreen/StudentLogin.JPG)

- After the login success, I can see my home page with two links in the header.

![StudentHP](./testImage/StudentScreen/StudentHP.JPG)

- If I click on My Booked Lecture I can see the calendar with my booked lectures. In this test there are no booked lessons.

![EmptyCalendar](./testImage/StudentScreen/EmptyCalendar.JPG)

### Test 8 (A student access a calendar in week view)
- Like a student I need to put my credentials in the login form and then press the button Login. 

![LoginForm](./testImage/StudentScreen/StudentLogin.JPG)

- After the login success, I can see my home page with two links in the header.

![StudentHP](./testImage/StudentScreen/StudentHP.JPG)

- If I click on My Booked Lecture I can see the calendar with my booked lectures. In this test I use the Week view of calendar, the default one.

![WeekCalendar](./testImage/StudentScreen/CalendarWeekView.JPG)

### Test 9 (A student access a calendar in day view)
- Like a student I need to put my credentials in the login form and then press the button Login. 

![LoginForm](./testImage/StudentScreen/StudentLogin.JPG)

- After the login success, I can see my home page with two links in the header.

![StudentHP](./testImage/StudentScreen/StudentHP.JPG)

- If I click on My Booked Lecture I can see the calendar with my booked lectures. The default view is the week view.

![WeekCalendar](./testImage/StudentScreen/CalendarWeekView.JPG)

- If I click on the button in the right side of the calendar and I press Day, I can see the day view of my booked lectures.

![DayCalendar](./testImage/StudentScreen/CalendarDayView.JPG)


### Test 10 (A student access a calendar in month view)
- Like a student I need to put my credentials in the login form and then press the button Login. 

![LoginForm](./testImage/StudentScreen/StudentLogin.JPG)

- After the login success, I can see my home page with two links in the header.

![StudentHP](./testImage/StudentScreen/StudentHP.JPG)

- If I click on My Booked Lecture I can see the calendar with my booked lectures. The default view is the week view.

![WeekCalendar](./testImage/StudentScreen/CalendarWeekView.JPG)

- If I click on the button in the right side of the calendar and I press Month, I can see the month view of my booked lectures.

![MonthCalendar](./testImage/StudentScreen/CalendarMonthView.JPG)

### Test 11 (A student access a calendar in week view and click on the lesson)
- Like a student I need to put my credentials in the login form and then press the button Login. 

![LoginForm](./testImage/StudentScreen/StudentLogin.JPG)

- After the login success, I can see my home page with two links in the header.

![StudentHP](./testImage/StudentScreen/StudentHP.JPG)

- If I click on My Booked Lecture I can see the calendar with my booked lectures. The default view is the week view.

![WeekCalendar](./testImage/StudentScreen/CalendarWeekView.JPG)

- If I click on the button in the right side of the calendar and I press Month, I can see the month view of my booked lectures.

![MonthCalendar](./testImage/StudentScreen/CalendarMonthView.JPG)

- If I click on one lesson in the calendar, a popup with all the information about the lecture is shown.

![PopUp](./testImage/StudentScreen/CalendarPopUp.JPG)

## Story 7 
###### As a teacher I want to cancel a lecture up to 1h before its scheduled time.
### Test 12 (A teacher try to cancel a lecture but the time is expired)
- Like a teacher I need to put my credentials in the login form and then press the button Login.

![LoginForm](./testImage/TeacherScreen/TeacherLogin.JPG)

- After the login success, I can see my home page with three links in the header

![TeacherHP](./testImage/TeacherScreen/TeacherHP.JPG)

- If I click on Manage Lectures I can see the list of my lectures. 

![ManageLecture](./testImage/TeacherScreen/ManageLecture.JPG)

- If I click on button Delete, I should be able to delete the lecture only if this moment is before 1h the scheduled time. If I click, a modal confirmation in shown.

![ModalDeleteConfirm](./testImage/TeacherScreen/ModalConfirmDelete.JPG)

- If I click on button Yes, in this case a modal with the information about the expire time is shown and the delete is blocked.

![ModaleDeleteError](./testImage/TeacherScreen/ErrorDelete.JPG)

### Test 13 (A teacher try to cancel a lecture and the time is not expired)
- Like a teacher I need to put my credentials in the login form and then press the button Login.

![LoginForm](./testImage/TeacherScreen/TeacherLogin.JPG)

- After the login success, I can see my home page with three links in the header

![TeacherHP](./testImage/TeacherScreen/TeacherHP.JPG)

- If I click on Manage Lectures I can see the list of my lectures. 

![ManageLecture](./testImage/TeacherScreen/ManageLecture.JPG)

- If I click on button Delete, I should be able to delete the lecture only if this moment is before 1h the scheduled time. If I click, a modal confirmation in shown.

![ModalDeleteConfirm](./testImage/TeacherScreen/ModalConfirmDelete.JPG)

- If I click on button Yes, in this case a modal with the information about the success is shown.

![ModaleDeleteSuccess](./testImage/TeacherScreen/ModalDeleteSuccess.JPG)

## Story 8 
###### As a student I want to get notified when a lecture is cancelled.
### Test 14 (A student receive an email when the teacher cancel a lecture when he is booked )
- As a student I receive an email when the teacher cancel one of my booked lectures 

![MailCancelLecture](./testImage/StudentScreen/DeleteLectureMail.JPG)

## Story 9
###### As a teacher I want to turn a presence lecture into a distance one up to 30 mins before its scheduled time.
### Test 15 (A teacher try to turn a presence lecture into a distance one but the time is expired)
- Like a teacher I need to put my credentials in the login form and then press the button Login.

![LoginForm](./testImage/TeacherScreen/TeacherLogin.JPG)

- After the login success, I can see my home page with three links in the header

![TeacherHP](./testImage/TeacherScreen/TeacherHP.JPG)

- If I click on Manage Lectures I can see the list of my lectures. 

![ManageLecture](./testImage/TeacherScreen/ManageLecture.JPG)

- If I click on button Switch to Virtual, I should be able to switch the lecture only if this moment is before 30m the scheduled time. If I click, a modal confirmation in shown.

![ModalChangeConfirm](./testImage/TeacherScreen/ModalConfirmChange.JPG)

- If I click on button Yes, in this case a modal with the information about the expire time is shown and the change is blocked.

![ModaleChangeError](./testImage/TeacherScreen/ErrorChangeModal.JPG)

### Test 16 (A teacher try to turn a presence lecture into a distance one and the time is not expired)
- Like a teacher I need to put my credentials in the login form and then press the button Login.

![LoginForm](./testImage/TeacherScreen/TeacherLogin.JPG)

- After the login success, I can see my home page with three links in the header

![TeacherHP](./testImage/TeacherScreen/TeacherHP.JPG)

- If I click on Manage Lectures I can see the list of my lectures. 

![ManageLecture](./testImage/TeacherScreen/ManageLecture.JPG)

- If I click on button Switch to Virtual, I should be able to switch the lecture only if this moment is before 30m the scheduled time. If I click, a modal confirmation in shown.

![ModalChangeConfirm](./testImage/TeacherScreen/ModalConfirmChange.JPG)

- If I click on button Yes, in this case a modal with the information about the success is shown.

![ModaleChangeSuccess](./testImage/TeacherScreen/ModalChangeSuccess.JPG)

- The new list of lectures is available with the new information about the virtual lecture.

![ManageLectureWithVirtual](./testImage/TeacherScreen/ManageLectureWithOneVirtual.JPG)

## Story 10
###### As a teacher I want to access the historical data about bookings so that I can plan better.
### Test 17 (A teacher access to the statistics page but no data are present in the system)
- Like a teacher I need to put my credentials in the login form and then press the button Login.

![LoginForm](./testImage/TeacherScreen/TeacherLogin.JPG)

- After the login success, I can see my home page with three links in the header

![TeacherHP](./testImage/TeacherScreen/TeacherHP.JPG)

- If I click on Statistics I can see the statistics of my lectures. 

![StatsView](./testImage/TeacherScreen/StatsView.JPG)

- After the selection of the course, I can choose one of the different view of the stats. 

![ButtonStats](./testImage/TeacherScreen/StatsButton.JPG)

- If I click on View Booking of single lecture, a dropdown menù is shown with all my lecture.

![DropDown](./testImage/TeacherScreen/DropDownStats.JPG)

- If I click on the lecture, in this test, a message is shown because there aren't available data for the selected lecture.

![EmptyStats](./testImage/TeacherScreen/StatisticsWithNoData.JPG)

### Test 18 (A teacher access to the statistics page and select the single lecture view)
- Like a teacher I need to put my credentials in the login form and then press the button Login.

![LoginForm](./testImage/TeacherScreen/TeacherLogin.JPG)

- After the login success, I can see my home page with three links in the header

![TeacherHP](./testImage/TeacherScreen/TeacherHP.JPG)

- If I click on Statistics I can see the statistics of my lectures. 

![StatsView](./testImage/TeacherScreen/StatsView.JPG)

- After the selection of the course, I can choose one of the different view of the stats. 

![ButtonStats](./testImage/TeacherScreen/StatsButton.JPG)

- If I click on View Booking of single lecture, a dropdown menù is shown with all my lecture.

![DropDown](./testImage/TeacherScreen/DropDownStats.JPG)

- If I click on the lecture, in this test, a graph is shown.

![LectureStats](./testImage/TeacherScreen/LectureStats.JPG)

### Test 19 (A teacher access to the statistics page and select the week view)
- Like a teacher I need to put my credentials in the login form and then press the button Login.

![LoginForm](./testImage/TeacherScreen/TeacherLogin.JPG)

- After the login success, I can see my home page with three links in the header

![TeacherHP](./testImage/TeacherScreen/TeacherHP.JPG)

- If I click on Statistics I can see the statistics of my lectures. 

![StatsView](./testImage/TeacherScreen/StatsView.JPG)

- After the selection of the course, I can choose one of the different view of the stats. 

![ButtonStats](./testImage/TeacherScreen/StatsButton.JPG)

- If I click on View Booking of week, a graph is shown.

![WeekStats](./testImage/TeacherScreen/WeekStats.JPG)

### Test 20 (A teacher access to the statistics page and select the month view)
- Like a teacher I need to put my credentials in the login form and then press the button Login.

![LoginForm](./testImage/TeacherScreen/TeacherLogin.JPG)

- After the login success, I can see my home page with three links in the header

![TeacherHP](./testImage/TeacherScreen/TeacherHP.JPG)

- If I click on Statistics I can see the statistics of my lectures. 

![StatsView](./testImage/TeacherScreen/StatsView.JPG)

- After the selection of the course, I can choose one of the different view of the stats. 

![ButtonStats](./testImage/TeacherScreen/StatsButton.JPG)

- If I click on View Booking of month, a graph is shown.

![MonthStats](./testImage/TeacherScreen/MonthStats.JPG)

### Test 21 (A teacher access to the statistics page and select the total bookings view)
- Like a teacher I need to put my credentials in the login form and then press the button Login.

![LoginForm](./testImage/TeacherScreen/TeacherLogin.JPG)

- After the login success, I can see my home page with three links in the header

![TeacherHP](./testImage/TeacherScreen/TeacherHP.JPG)

- If I click on Statistics I can see the statistics of my lectures. 

![StatsView](./testImage/TeacherScreen/StatsView.JPG)

- After the selection of the course, I can choose one of the different view of the stats. 

![ButtonStats](./testImage/TeacherScreen/StatsButton.JPG)

- If I click on View Total Bookings, a graph is shown.

![TotalStats](./testImage/TeacherScreen/TotalBookingStats.JPG)

### Test 22 (A teacher access to the statistics page and select the cancelled bookings view)
- Like a teacher I need to put my credentials in the login form and then press the button Login.

![LoginForm](./testImage/TeacherScreen/TeacherLogin.JPG)

- After the login success, I can see my home page with three links in the header

![TeacherHP](./testImage/TeacherScreen/TeacherHP.JPG)

- If I click on Statistics I can see the statistics of my lectures. 

![StatsView](./testImage/TeacherScreen/StatsView.JPG)

- After the selection of the course, I can choose one of the different view of the stats. 

![ButtonStats](./testImage/TeacherScreen/StatsButton.JPG)

- If I click on View Cancelled Bookings, a graph is shown.

![CancelledStats](./testImage/TeacherScreen/CancelledBookingsStats.JPG)

## Story 11
###### As a booking manager I want to monitor usage (booking, cancellations, attendance) of the system.
## Story 12
###### As a support officer I want to upload the list of students, courses, teachers, lectures, and classes to setup the system.
## Story 13
###### As a student I want to be put in a waiting list when no seats are available in the required lecture.
## Story 14 
###### As a student in the waiting list I want to be added to the list of students booked when someone cancels their booking so that I can attend the lecture.
## Story 15
###### As a student I want to get notified when I am taken from the waiting list so that I can attend the lecture.
## Story 16 
###### As a booking manager I want to generate a contact tracing report starting with a positive student so that we comply with safety regulations.
