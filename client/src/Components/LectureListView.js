import React from 'react';
import { ListGroup, Col, Row, Jumbotron, Button, Modal } from 'react-bootstrap';
import API from '../api/API';


class LectureListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = { lectures: [], showBookSuccess: false};
    }
    componentDidMount() {
        API.getLecturesList(this.props.email)
            .then((lectures) => this.setState({ lectures: lectures }));
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

    handleClose = () => {
        this.setState({ showDeleteSuccess: false });
    }

    //handleBookClick = (lecture, lectureId) => {
    //    this.setState({showBookSuccess: true, booklecture: lecture, booklectureId: lectureId});
    //}

    // handleBook = (event, lecture, lectureId) => {
    //     event.preventDefault();

    // }

    //Book = (lectureId) =>{
    //    API.bookLecture
    //}
    handleClose = () => {
        this.setState({ showBookSuccess: false });
    }

    render() {

        return (
            <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                <Row className='col-12 m-0 p-0'>
                    <Col>
                        <LectureList lecture={this.state.lectures} findCourseName={this.findCourseName} findTeacherName = {this.findTeacherName} findMaxSeats={this.findMaxSeats} />
                    </Col>
                </Row>
                <Modal controlid='BookSuccess' show={this.state.showBookSuccess} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Your book is saved! Good Lesson!</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant='primary' onClick={this.handleClose}>Close</Button>
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

                    <LectureItem key={l.lectureId} lecture={l} findCourseName = {props.findCourseName} findTeacherName = {props.findTeacherName} findMaxSeats={props.findMaxSeats} />
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
                    <Button>Book</Button>
                </Col>
                <Col xs={1} className='text-center'>
                    <Button>Delete</Button>
                </Col>
            </Row>
        </ListGroup.Item>
    );
    
}



export default LectureListView;
