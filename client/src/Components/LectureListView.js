import React from 'react';
import { ListGroup, Col, Row, Jumbotron, Button, Modal } from 'react-bootstrap';
import API from '../api/API';
import Booking from '../api/booking';

class LectureListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = { lectures: [], showBook: false, showBookSuccess: false, id: '', lecture: '', bookings: [], student: '', showDoubleBookError: false};
    }
    componentDidMount() {
        API.getLecturesList(this.props.email)
            .then((lectures) => this.setState({ lectures: lectures }));
        this.setState({id: this.props.id});
        API.getAllBookings().then((bookings) => this.setState({bookings: bookings}));
        API.getPersonName(this.props.email).then((student) => this.setState({student: student}));
    }

    findCourseName = (courseId) => {
        let course = this.props.courses.find((c) => c.courseId == courseId);
        return course.name;
    }

    findTeacherName = (teacherId) => {
        let teacher = this.props.teachers.find((t) => t.id == teacherId);
        return teacher; 
    }

    findMaxSeats = (classroomId) => {
        let classroom = this.props.classrooms.find((c) => c.classroom == classroomId);
        return classroom.maxNumberOfSeats;
    }

    handleDeleteClick = (lecture, lectureId) => {
        this.setState({showDeleteSuccess: true, booklecture: lecture, booklectureId: lectureId});
    }
    
    addBooking = (booking) => {
        API.bookSeat(booking);
    }

    handleIncreaseSeats = (lecture) => {
        API.increaseSeats(lecture);
    }

    handleEmail = (recipient, subject, message) => {
        API.sendEmail(recipient, subject, message);
    }

    handleBook = (studentId, lecture) => {
        let find=false;
        for(let b of this.state.bookings){
            if(b.studentId == studentId && b.lectureId == lecture.lectureId )
                find = true;
        }

        if(find)
            this.setState({showDoubleBookError: true});
        else {
            let b = Object.assign({}, Booking);
            b.studentId = studentId;
            b.lectureId = lecture.lectureId;
            b.date = lecture.date;
            b.startingTime = lecture.startingTime;
            //this.addBooking(b);
            //this.handleIncreaseSeats(lecture);

            this.setState({showBook: false}, () => API.getLecturesList(this.props.email)
                .then((lectures) => this.setState({lectures: lectures, showBookSuccess: true})));

            const subject = "Booking confirmed";
            const message = `Dear ${this.state.student.name},\n` +  
                            `your booking for the course ${this.findCourseName(lecture.courseId)} ` +   
                            `of ${lecture.date} at ${lecture.startingTime} has been confirmed.\n` + 
                            `Please if you cannot be present for the lecture remeber to cancel your booking.\n` + 
                            `Have a nice lesson and remember to wear the mask. Togheter we can defeat Covid.`;
            
            this.handleEmail(this.props.email, subject, message);
            
        }
    }

    handleClickBook = (id, lecture) => {
        this.setState({showBook: true, lecture: lecture, id: id});
    }

    handleClose = () => {
        this.setState({ showBook: false, showBookSuccess: false, showDoubleBookError: false });
    }

    render() {

        return (
            <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                <Row className='col-12 m-0 p-0'>
                    <Col>
                        <LectureList handleClickBook={this.handleClickBook} id={this.state.id} lecture={this.state.lectures} findCourseName={this.findCourseName} findTeacherName = {this.findTeacherName} findMaxSeats={this.findMaxSeats} />
                    </Col>
                </Row>
                <Modal controlid='Book' show={this.state.showBook} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                       <Modal.Title>Confirm booking</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to confirm your book?</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={()=>this.handleBook(this.state.id, this.state.lecture)}>Yes</Button>
                        <Button variant='secondary' onClick={this.handleClose}>No</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='DeleteSuccess' show={this.state.showDeleteSuccess} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Book</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to delete your lesson prenotation?</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={this.handleClose}>No</Button>
                        <Button variant='secondary' onClick={this.handleClose}>Yes</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='BookSuccess' show={this.state.showBookSuccess} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                       <Modal.Title>Confirm booking</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Congrats, your booking is saved! Enjoy the lesson!</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={()=>this.handleClose()}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='BookError' show={this.state.showDoubleBookError} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                       <Modal.Title>ERROR!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You have already book this lesson!</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={()=>this.handleClose()}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Jumbotron>

        );
    }
}

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
                        <strong>Seats</strong>
                    </Col>
                    <Col xs={1}></Col>
                    <Col xs={1}></Col>
                </Row>

            </ListGroup.Item>
            {
                props.lecture.map((l) =>

                    <LectureItem handleClickBook={props.handleClickBook} id={props.id} key={l.lectureId} lecture={l} findCourseName = {props.findCourseName} findTeacherName = {props.findTeacherName} findMaxSeats={props.findMaxSeats} />
                )


            }
        </ListGroup>

    );

}

function LectureItem(props) {
    let courseName = props.findCourseName(props.lecture.courseId);
    let teacher = props.findTeacherName(props.lecture.teacherId);
    let maxSeats = props.findMaxSeats(props.lecture.classroomId);
    return (
        <ListGroup.Item className='border mt-1'>
            <Row className='justify-content-around'>
                <Col xs={1} className='text-center'>
                    {courseName}
                </Col>
                <Col xs={1} className='text-center'>
                    {teacher.surname}-{teacher.name}
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
                    {props.lecture.numberOfSeats &&
                        <>
                        {props.lecture.numberOfSeats}/{maxSeats}
                        </>
                    } 
                    {!props.lecture.numberOfSeats &&
                        <>
                        {0}/{maxSeats}
                        </>
                    } 
                    
                    
                </Col>
                <Col xs={1} className='text-center'>
                    {(props.lecture.numberOfSeats >= maxSeats) &&
                    <>
                        <Button disabled >Book</Button>
                    </>
                    }
                    {(props.lecture.numberOfSeats < maxSeats) &&
                    <>
                         <Button onClick={() => props.handleClickBook(props.id, props.lecture)} >Book</Button>
                    </>

                    }
                </Col>
                <Col xs={1} className='text-center'>
                    <Button>Delete</Button>
                </Col>
            </Row>
        </ListGroup.Item>
    );
    
}



export default LectureListView;
