import React from 'react';
import { ListGroup, Col, Row, Jumbotron, Button, Modal } from 'react-bootstrap';
import API from '../api/API';
const moment = require('moment');

class ManageLectureList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { lectures: [], bookings: [], showDelete: false, showDeleteSuccess: false, showDeleteError: false, showChange: false, showChangeError: false, showChangeSuccess: false, lecture: '' };
    }

    /**
     * Retrieves the list of all future lectures of the teacher and the list of all registered bookings
     */
    componentDidMount() {
        API.getTeacherLecturesList(this.props.id)
            .then((lectures) => this.setState({ lectures: lectures }));
        API.getAllBookings().then((bookings) => this.setState({ bookings: bookings }));
    }

    /**
     * Retrieves the name of a course based on its identifier
     * @param courseId a string containing the identifier of the course whose name is to be retrieved
     */
    findCourseName = (courseId) => {
        let course = this.props.courses.find((c) => c.courseId == courseId);
        return course.name;
    }


    /**
     * Retrieves the maximum number of available seats in a classroom
     * @param classroomId a string containing the identifier of the classroom whose number of seats is to be found
     */
    findMaxSeats = (classroomId) => {
        let classroom = this.props.classrooms.find((c) => c.classroom == classroomId);
        return classroom.maxNumberOfSeats;
    }

    /**
     * Called when a teacher chooses to confirm the cancellation of a lecture in the corresponding modal.
     * Checks if the lecture isn't taking place in the current date: if true then it can be deleted with no issue, while if it is then it checks if there's enough time (up to one hour before the start of the lecture)
     * If the lecture can be deleted it calls the adequate methods, while if it can't is shows an error modal.
     * @param lecture a Lecture object containing information about the lecture to be deleted
     */
    handleDelete = (lecture) => {
        let deadline = moment().format("HH:mm");
        let startingTime = moment(lecture.startingTime, "HH:mm").subtract(1, "hour").format("HH:mm");
        let today = moment().format("DD/MM/YYYY");
        if(lecture.date > today){
            this.deleteLecture(lecture)
            this.deleteBookingByTeacher(lecture.lectureId);
            API.getTeacherLecturesList(this.props.id).then((lectures) => this.setState({lectures: lectures}));
            this.setState({showDelete: false});
        }else{
            if(startingTime < deadline){
                this.setState({showDelete: false, showDeleteError: true});
            }
            else {
                this.deleteLecture(lecture);
                this.deleteBookingByTeacher(lecture.lectureId);
                API.getTeacherLecturesList(this.props.id).then((lectures) => this.setState({ lectures: lectures }));
            }
        }

    }

    /**
     * Called when a teacher chooses to confirm the change of type of a lecture (from in presence to virtual) in the corresponding modal.
     * Checks if the lecture isn't taking place in the current date: if true then it can be deleted with no issue, while if it is then it checks if there's enough time (up to 30 minutes before the start of the lecture)
     * If the lecture type can be changed it calls the adequate methods, while if it can't is shows an error modal.
     * @param lecture a Lecture object containing information about the lecture whose type has to be changed
     */
    handleChange = (lecture) => {
        let deadline = moment().format("HH:mm");
        let startingTime = moment(lecture.startingTime, "HH:mm").subtract(30, "minutes").format("HH:mm");
        let today = moment().format("DD/MM/YYYY");
        if (lecture.date > today) { // FIXME: remove unecessary nested id statement
            this.changeType(lecture);
            this.deleteBookingByTeacher(lecture.lectureId);
            API.getTeacherLecturesList(this.props.id).then((lectures) => this.setState({ lectures: lectures }));
        } else {
            if (startingTime < deadline) {
                this.setState({ showChange: false, showChangeError: true });
            }
            else {
                this.changeType(lecture);
                this.deleteBookingByTeacher(lecture.lectureId);
                API.getTeacherLecturesList(this.props.id).then((lectures) => this.setState({ lectures: lectures }));
            }
        }
    }

    /**
     * Calls the API that deletes a lecture and the API that saves the newly cancelled lecture in the appropriate table
     * Calls the API that gets the list of future lectures of the teacher to have it updated and closes the confirmation modal
     * @param lecture a Lecture object containing information about the lecture to be deleted
     */
    deleteLecture = (lecture) => {
        API.deleteLecture(lecture).then(() => API.getTeacherLecturesList(this.props.id).then((lectures) => this.setState({ lectures: lectures, showDeleteSuccess: true, showDelete: false })));
        API.addCancelledLecture(lecture);
        API.getTeacherLecturesList(this.props.id).then((lectures) => this.setState({ lectures: lectures }));
    }

    /**
     * Changes the type of lecture to be virtual instead of in presence.
     * Calls the API that updates the lecture to the new type, then the API that gets the updated list of future lectures of the teacher, then closes the modal.
     * @param lecture a Lecture object containing information about the lecture whose type has to be changed
     */
    changeType = (lecture) => {
        lecture.inPresence = "0";
        API.updateLecture(lecture).then(() => API.getTeacherLecturesList(this.props.id).then((lectures) => this.setState({ lectures: lectures, showChangeSuccess: true, showChange: false })));
    }

    /**
     * Checks, for all bookings, if a booking has been made for a lecture that has been deleted/changed to virtual and calls the API that deletes a booking in such case.
     * @param lectureId an integer corresponding to the identifier of the lecture that has been deleted/changed to virtual
     */
    deleteBookingByTeacher = (lectureId) => {
        for (let b of this.state.bookings) {
            if (b.lectureId == lectureId)
                API.deleteBookingByTeacher(lectureId);
        }

    }

    /**
     * Called when a teacher chooses to change the type of a lesson from in presence to virtual.
     * Opens the modal asking for confirmation.
     * @param lecture a Lecture object containing information about the lecture whose type has to be changed
     */
    handleClickChange = (lecture) => {
        this.setState({ showChange: true, lecture: lecture });
    }

    /**
     * Called when a teacher chooses to delete a lesson.
     * Opens the modal asking for confirmation.
     * @param lecture a Lecture object containing information about the lecture to be deleted.
     */
    handleClickDelete = (lecture) => {
        this.setState({ showDelete: true, lecture: lecture });
    }

    /**
     * Called when a teacher closes one of the modals shown on the page (confirmation of cancellation, confirmation of type changing, error)
     */
    handleClose = () => {
        this.setState({ showChange: false, showChangeSuccess: false, showChangeError: false, showDelete: false, showDeleteError: false, showDeleteSuccess: false });
    }


    /**
     * Renders a list of all future lectures for courses taught by the teacher and the different modals that can pop up (confirmation of cancellation, confirmation of type changing, error, cancellation ending successfully, type changing ending successfully).
     * 
     */
    render() {

        return (
            <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                <Row className='col-12 m-0 p-0'>
                    <Col>
                        <LectureListManage lecture={this.state.lectures} findCourseName={this.findCourseName} findMaxSeats={this.findMaxSeats} handleClickChange={this.handleClickChange} handleClickDelete={this.handleClickDelete} />
                    </Col>
                </Row>
                <Modal controlid='Delete' show={this.state.showDelete} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm deleting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to confirm your deleting?</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.handleDelete(this.state.lecture)}>Yes</Button>
                        <Button variant='secondary' onClick={this.handleClose}>No</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='Change' show={this.state.showChange} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm change</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to change your type of lecture (from in presence to virtual)?</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.handleChange(this.state.lecture)}>Yes</Button>
                        <Button variant='secondary' onClick={this.handleClose}>No</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='DeleteSuccess' show={this.state.showDeleteSuccess} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm deleting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Congrats, your lecture is deleted! A mail has been sent to all students!</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.handleClose()}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='DeleteError' show={this.state.showDeleteError} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>ERROR!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You can't delete this lesson now! Time is expired!</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.handleClose()}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='ChangeSuccess' show={this.state.showChangeSuccess} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm changing</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Your lesson has been changed. Now it is a virtual lecture!</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.handleClose()}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='ChangeError' show={this.state.showChangeError} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>ERROR!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You can't change this lesson now! Time is expired!</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.handleClose()}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Jumbotron>

        );
    }
}

/**
 * Renders the list of all future lectures of the teacher.
 * @param props array of Lecture objects, functions to close modals, functions to find name of the course and maximum amount of available seats.
 */
function LectureListManage(props) {

    return (
        <ListGroup>
            <Row className='justify-content-around'>
                <h1>Manageble lectures</h1>
            </Row>
            <ListGroup.Item className='border'>
                <Row className='justify-content-around'>
                    <Col xs={1} className='text-center'>
                        <strong>Course Name</strong>
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
                        <strong>Seats</strong>
                    </Col>
                    <Col xs={1}></Col>
                    <Col xs={2}></Col>
                </Row>

            </ListGroup.Item>
            {
                props.lecture.map((l) =>

                    <LectureItemManage key={l.lectureId} lecture={l} findCourseName={props.findCourseName} findMaxSeats={props.findMaxSeats} handleClickChange={props.handleClickChange} handleClickDelete={props.handleClickDelete} />
                )


            }
        </ListGroup>

    );

}

/**
 * Renders a list item made of one future lecture of the teacher, with a button to delete the lecture and one to change its type to virtual.
 * @param props a single Lecture object with its identifier, functions to close modals, functions to find name of the course and maximum amount of available seats.
 */
function LectureItemManage(props) {
    let courseName = props.findCourseName(props.lecture.courseId);
    let maxSeats = props.findMaxSeats(props.lecture.classroomId);

    return (
        <ListGroup.Item className='border mt-1'>
            <Row className='justify-content-around'>
                <Col xs={1} className='text-center'>
                    {courseName}
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
                    {(props.lecture.inPresence == true || props.lecture.inPresence == 1) &&
                        <>
                            {props.lecture.classroomId}
                        </>}
                    {(props.lecture.inPresence == false || props.lecture.inPresence == 0) &&
                        <>
                            Virtual Classroom
                    </>}
                </Col>
                <Col xs={1} className='text-center'>
                    {props.lecture.inPresence == 1 &&
                        <>
                            {props.lecture.numberOfSeats}/{maxSeats}
                        </>
                    }
                    { props.lecture.inPresence == 0 &&
                        <>
                            Free to entry
                    </>}


                </Col>
                <Col xs={1} className='text-center'>
                    <Button variant='danger' onClick={() => props.handleClickDelete(props.lecture)}>Delete</Button>
                </Col>
                <Col xs={2} className='text-center'>
                    {props.lecture.inPresence == 0 &&
                        <>
                            <Button disabled>Change Type</Button>
                        </>
                    }
                    {props.lecture.inPresence == 1 &&
                        <>
                            <Button onClick={() => props.handleClickChange(props.lecture)}>Change type</Button>
                        </>
                    }

                </Col>
            </Row>
        </ListGroup.Item>
    );

}



export default ManageLectureList;
