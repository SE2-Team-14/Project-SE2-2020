import React from 'react';
import { ListGroup, Col, Row, Jumbotron, Button, Modal } from 'react-bootstrap';
import API from '../api/API';
import Booking from '../api/booking';
import { AuthContext } from '../auth/AuthContext';
import { Redirect } from 'react-router-dom';

class LectureListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            lectures: [],
            showBook: false,
            showBookSuccess: false,
            id: '',
            lecture: '',
            bookings: [],
            student: '',
            waitingList: [],
            showDoubleBookError: false,
            showDelete: false,
            showDeleteSuccess: false,
            showDeleteFail: false, 
            showBookWaitingList: false,
            showBookWaitingListSuccess: false
        };
    }

    /**
     * Retrieves the list of all future lectures for courses of the student, all existing bookings and the name of the person
     */
    componentDidMount() {
        API.getLecturesList(this.props.id)
            .then((lectures) => this.setState({ lectures: lectures}));
        this.setState({ id: this.props.id });
        API.getAllBookings().then((bookings) => this.setState({ bookings: bookings }));
        API.getPersonName(this.props.email).then((student) => this.setState({ student: student }));
        API.getAllWaitingList().then((waitingList) => this.setState({waitingList : waitingList}));
    }


    /**
     * Searches through all registered bookings to find if there is already an existing booking for the given student and lecture
     * @param studentId a string containing the identifier of the student whose booking is being looked for
     * @param lectureId an integer corresponding to the identifier of the lecture the student may be booked in
     */
    findBooking = (studentId, lectureId) => {
        let find = false;
        for (let b of this.state.bookings) {
            if ((b.studentId == studentId) && (b.lectureId == lectureId))
                find = true;
        }
        return find;
    }

    findBookingInWaitingList = (courseId, studentId) => {
        let find = false;
        for (let w of this.state.waitingList) {
            if ((w.studentId == studentId) && (w.lessonId == courseId))
                find = true;
        }
        return find;
    }

    /**
     * Returns the name of one of the saved courses of the student
     * @param courseId a string containing the identifier of the course whose name is to be retrieved
     */
    findCourseName = (courseId) => {
        let course = this.props.courses.find((c) => c.courseId == courseId);
        return course.name;
    }

    /**
     * Returns, from the list of all teacher received as a prop by the parent component, information about the teacher associated with the id
     * @param teacherId a string containing the identifier of the teacher that is being researched
     */
    findTeacherName = (teacherId) => {
        let teacher = this.props.teachers.find((t) => t.id == teacherId);
        return teacher;
    }

    /**
     * Returns, from the list of all classroom in the system received as a prop by the parent component, the maximum number of available seats for the classroom associated with the id
     * @param classroomId a string containing the identifier of the classroom whose maximum number of seats is being researched
     */
    findMaxSeats = (classroomId) => {
        let classroom = this.props.classrooms.find((c) => c.classroom == classroomId);
        return classroom.maxNumberOfSeats;
    }

    /**
     * Calls the API that will book a seat for the logged student for a particular lecture.
     * Retrieves, after saving the booking, all existing bookings again to update the rendered page and stop a student from booking the same lecture multiple times.
     * @param booking a Booking object containing information about the booking to be saved
     * @param studentName a string containing the name of the student that made the booking
     * @param courseName a string containing the name of the course associated with the booked lecture
     * @param date a string containing the date in which the booked lecture will take place, in format DD/MM/YYYY
     * @param startingTime a string containing the hour at which the booked lecture will start, in format HH:MM
     * @param recipient a string containing the email of the student that performed the booking. Used to make sure that the student receives a confirmation email
     */
    addBooking = (booking, studentName, courseName, date, startingTime, recipient) => {
        API.bookSeat(booking, studentName, courseName, date, startingTime, recipient).then(() => API.getAllBookings().then((bookings) => this.setState({ bookings: bookings })));
    }

    /**
     * Calls the API that will delete a seat booked by the logged student for a particular lecture.
     * Retrieves, after the cancellation, all  existing bookings again to update the rendered page and allow a student to eventually book again a seat for the lecture.
     * @param studentId a string containing the identifier of the student that wishes to delete a booking
     * @param lectureId an integer corresponding to the lecture associated to the booking 
     */
    deleteBooking = (studentId, lectureId) => {
        API.deleteBooking(studentId, lectureId).then(() => API.getAllBookings().then((bookings) => this.setState({ bookings: bookings })));
    }

    /**
     * Calls the API that will save in the appropriate table in the database a newly deleted booking
     * @param studentId a string containing the identifier of the student that deleted a booking
     * @param lectureId an integer corresponding to the lecture associated to the deleted booking
     */
    addDeletedBooking = (studentId, lectureId) => {
        API.addCancelledBooking(studentId, lectureId);
    }

    /**
     * Increases the number of booked seats for a lecture after a successful booking and then calls the API that updates information about lectures in the database
     * @param lecture a Lecture object corresponding to the lecture that must be updated
     */
    handleIncreaseSeats = (lecture) => {
        lecture.numberOfSeats++;
        API.updateLecture(lecture);
    }

    /**
     * Decreases the number of booked seats for a lecture after a successful unbooking and then calls the API that updates information about lectures in the database
     * @param lecture a Lecture object corresponding to the lecture that must be updated
     */
    handleDecreaseSeats = (lecture) => {
        lecture.numberOfSeats--;
        API.updateLecture(lecture);
    }


    /**
     * Called when a student, while inside the modal that pops up after choosing to book a seat for a lecture, confirms his intention to book a seat by pressing the yes button.
     * Calls all functions related to saving a successful booking after creating a new Booking object associated with the student and the lecture.
     * After saving is done updates the list of all bookings and of lectures of the student, and also stops showing the modal asking for booking confirmation and shows instead one that confirms saving ended successfully.
     * @param studentId a string containing the identifier of the student that performed the booking
     * @param lecture a Lecture object containing all information related to the booked lecture
     */
    handleBook = (studentId, lecture) => {
        let b = Object.assign({}, Booking);
        b.studentId = studentId;
        b.lectureId = lecture.lectureId;
        b.date = lecture.date;
        b.startingTime = lecture.startingTime;
        this.addBooking(b, this.state.student.name, this.findCourseName(lecture.courseId), lecture.date, lecture.startingTime, this.props.email);
        this.handleIncreaseSeats(lecture);
        API.getAllBookings().then((bookings) => this.setState({ bookings: bookings }, () => this.setState({ showBook: false }, () => API.getLecturesList(this.props.id)
            .then((lectures) => this.setState({ lectures: lectures, showBookSuccess: true })))));
    }

    /**
     * Called when a student, while inside the modal that pops up after choosing to cancel a booked seat, confirms his intention to delete the booking by pressing the yes button.
     * Calls all functions related to deleting a booking and saving information about this deletion.
     * After saving is done updates the list of all bookings and of lectures of the student, and also stops showing the modal asking for booking confirmation and shows instead one that confirms saving ended successfully.
     * @param studentId a string containing the identifier of the student that performed the cancellation
     * @param lecture a Lecture object containing all information related to the unbooked lecture
     */
    handleDelete = (studentId, lecture) => {
        this.deleteBooking(studentId, lecture.lectureId)
        this.addDeletedBooking(studentId, lecture.lectureId)
        this.handleDecreaseSeats(lecture)
        API.getAllBookings().then((bookings) => this.setState({ bookings: bookings }));
        this.setState({ showDelete: false }, () => API.getLecturesList(this.props.id)
            .then((lectures) => this.setState({ lectures: lectures, showDeleteSuccess: true })));
    }

    /**
     * Called when a student, while inside the modal that pops up after choosing to cancel a booked seat, confirms his intention to delete the booking by pressing the yes button.
     * Calls all functions related to deleting a booking and saving information about this deletion.
     * After saving is done updates the list of all bookings and of lectures of the student, and also stops showing the modal asking for booking confirmation and shows instead one that confirms saving ended successfully.
     * @param studentId a string containing the identifier of the student that performed the cancellation
     * @param lecture a Lecture object containing all information related to the unbooked lecture
     */
    handleBookWaitingList = (studentId, lecture) => {
        API.putInWaitingList(studentId, lecture.lectureId);
        this.setState({ showBookWaitingList: false}, () => API.getLecturesList(this.props.id)
        .then((lectures) => this.setState({ lectures: lectures, showBookWaitingListSuccess: true },
         () => API.getAllWaitingList().then((waitingList) => this.setState({waitingList : waitingList})))));
    }

    /**
     * Called when a students clicks on the Book button associated to a lecture with no already booked seat and enough seats left in the rendered list. 
     * Shows the modal for confirming a booking.
     * @param id a string containing the identifier of the student that is performing the booking
     * @param lecture a Lecture object containing all information about the lecture to be booked
     */
    handleClickBook = (id, lecture) => {
        this.setState({ showBook: true, lecture: lecture, id: id });
    }

    /**
     * Called when a students clicks on the Delete button associated to a lecture with an already booked seat. 
     * Shows the modal for deleting a booking.
     * @param id a string containing the identifier of the student that is performing the cancellation
     * @param lecture a Lecture object containing all information about the lecture related to the seat to unbook.
     */
    handleClickDelete = (id, lecture) => {
        this.setState({ showDelete: true, lecture: lecture, id: id });
    }

    handleClickBookWaitingList = (studentId, lecture) => {
        this.setState({ showBookWaitingList: true, studentId : studentId, lecture: lecture});
    }
    /**
     * Called when a students chooses to close any of the modals shown by the page.
     * Closes the modal.
     */
    handleClose = () => {
        this.setState({ showBook: false, showBookSuccess: false, showDelete: false, showDeleteSuccess: false, showBookWaitingList: false, showBookWaitingListSuccess: false});
    }

    /**
     * Renders a list of all future lectures for courses the student is enrolled in and the different modals that can pop up (confirmation of booking, confirmation of cancelling a booked seat, booking ended successfully, cancellation ended successfully).
     * 
     */
    render() {        
        return (
            <AuthContext.Consumer>
            {(context) => (
            <>
            {(context.authErr || !context.authUser) && <Redirect to="/login"></Redirect>}
            <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                <Row className='col-12 m-0 p-0'>
                    <Col>
                        <LectureList handleClickBook={this.handleClickBook} handleClickDelete={this.handleClickDelete} handleClickBookWaitingList={this.handleClickBookWaitingList} id={this.state.id} lecture={this.state.lectures} findCourseName={this.findCourseName} findTeacherName={this.findTeacherName} findMaxSeats={this.findMaxSeats} find={this.findBooking} findwl={this.findBookingInWaitingList} />
                    </Col>
                </Row>
                <Modal controlid='Book' show={this.state.showBook} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm booking</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to confirm your book?</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.handleBook(this.state.id, this.state.lecture)}>Yes</Button>
                        <Button variant='secondary' onClick={this.handleClose}>No</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='Delete' show={this.state.showDelete} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm deleting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to delete your lesson prenotation?</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.handleDelete(this.state.id, this.state.lecture)}>Yes</Button>
                        <Button variant='secondary' onClick={this.handleClose}>No</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='BookSuccess' show={this.state.showBookSuccess} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm booking</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Congrats, your booking is saved! Enjoy the lesson!</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.handleClose()}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='DeleteSuccess' show={this.state.showDeleteSuccess} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm deleting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Your prenotation has been deleted</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.handleClose()}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='BookWaitingList' show={this.state.showBookWaitingList} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm booking in the waiting list</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to confirm your book in the waiting list?</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.handleBookWaitingList(this.state.id, this.state.lecture)}>Yes</Button>
                        <Button variant='secondary' onClick={this.handleClose}>No</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='BookWaitingListSuccess' show={this.state.showBookWaitingListSuccess} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm booking in the waiting list</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Your prenotation has been booked in the waiting list</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.handleClose()}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Jumbotron>
            </>
            )}
            </AuthContext.Consumer>
        );
    }

}

/**
 * Renders the list of future lectures of the student.
 * @param props functions to handle closing of modals, functions to find course name, teacher name, maximum number of seats, booking, identifier of a student, array of Lecture items
 */
function LectureList(props) {

    return (
        <ListGroup>
            <Row className='justify-content-around'>
                <h1>Bookable lectures</h1>
            </Row>
            <ListGroup.Item className='border'>
                <Row className='justify-content-around'>
                    <Col xs={1} className='text-center'>
                        <strong>Course Name</strong>
                    </Col>
                    <Col xs={1} className='text-center'>
                        <strong>Teacher Name</strong>
                    </Col>
                    <Col xs={1} className='text-center'>
                        <strong>Date</strong>
                    </Col>
                    <Col xs={1} className='text-center'>
                        <strong>Starting Time</strong>
                    </Col>
                    <Col xs={1} className='text-center'>
                        <strong>Ending Time</strong>
                    </Col>
                    <Col xs={1} className='text-center'>
                        <strong>Classroom</strong>
                    </Col>
                    <Col xs={1} className='text-center'>
                        <strong>Booked Seats</strong>
                    </Col>
                    <Col xs={1}></Col>
                </Row>

            </ListGroup.Item>
            {
                props.lecture.map((l) =>

                    <LectureItem handleClickBook={props.handleClickBook} handleClickDelete={props.handleClickDelete} handleClickBookWaitingList={props.handleClickBookWaitingList} id={props.id} key={l.lectureId} lecture={l} findCourseName={props.findCourseName} findTeacherName={props.findTeacherName} findMaxSeats={props.findMaxSeats} findBooking={props.find} findBookingInWaitingList={props.findwl} />
                )
            }
        </ListGroup>

    );

}

/**
 * Renders a single row of the list of lectures, containing one lecture.
 * Other than lecture information (course name, teacher name and surname, date, starting and ending time, classroom) it also shows the amount of already booked seats in relation to the total amount.
 * A button is also present, with different behaviors:
 *  - if the student isn't already booked for the lesson and there are still seats available the Book button is unlocked and the Deletebutton isn't available
 *  - if the student isn't already booked for the lesson and there are no more seats available the Book button is locked and the Delete button isn't available
 *  - if the student is already booked for the lesson the Delete button is unlocked and the Book button isn't available
 * @param props functions to handle closing of modals, functions to find course name, teacher name, maximum number of seats, booking, identifier of a student, a single Lecture object with its identifier
 */
function LectureItem(props) {
    let find = props.findBooking(props.id, props.lecture.lectureId);
    let courseName = props.findCourseName(props.lecture.courseId);
    let teacher = props.findTeacherName(props.lecture.teacherId);
    let maxSeats = props.findMaxSeats(props.lecture.classroomId);
    let findwl = props.findBookingInWaitingList(props.lecture.lectureId, props.id);
    return (
        <ListGroup.Item className='border mt-1'>
            <Row className='justify-content-around'>
                <Col xs={1} className='text-center'>
                    {courseName}
                </Col>
                <Col xs={1} className='text-center'>
                    {teacher.surname} {teacher.name}
                </Col>
                <Col xs={1} className='text-center'>
                    {props.lecture.date}
                </Col>
                <Col xs={1} className='text-center'>
                    {props.lecture.startingTime}
                </Col>
                <Col xs={1} className='text-center'>
                    {props.lecture.endingTime}
                </Col>
                <Col xs={1} className='text-center'>
                    {props.lecture.classroomId}
                </Col>
                <Col xs={1} className='text-center'>
                    {props.lecture.numberOfSeats}/{maxSeats}
                </Col>
                <Col xs={1} className='text-center'>
                    {(find == true) &&
                        <>
                            <Button variant='danger' onClick={() => props.handleClickDelete(props.id, props.lecture)}>Delete</Button>
                        </>
                    }
                    {((find == false) && (props.lecture.numberOfSeats < maxSeats)) &&
                        <>
                            <Button onClick={() => props.handleClickBook(props.id, props.lecture)}>Book</Button>
                        </>

                    }
                    {((find == false) && (findwl == false) && (props.lecture.numberOfSeats >= maxSeats)) &&
                        <>
                            <Button onClick={() => props.handleClickBookWaitingList(props.id, props.lecture)}> Add in Waiting List</Button>
                        </>
                    }
                    {((find == false) && (findwl == true) && (props.lecture.numberOfSeats >= maxSeats)) &&
                        <>
                            <Button disabled> Add in Waiting List</Button>
                        </>
                    }
                </Col>
            </Row>
        </ListGroup.Item>
    );

}
export default LectureListView;
