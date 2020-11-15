import React from 'react';
import { ListGroup, Col, Row, Jumbotron, Button, Modal } from 'react-bootstrap';
import API from '../api/API';


class LectureListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = { lectures: [], showBookSuccess: false, names: [] };
    }
    componentDidMount() {
        API.getLecturesList(this.props.email)
            .then((lectures) => this.setState({ lectures: lectures }, () => this.state.lectures.map((l) => API.getCourseName(l.courseId).then((name) => this.state.names.push(name)))));
    }

    /* getCourseName = (courseId) => {
         API.getCourseName(courseId).then((name)=> console.log(name));
     }*/
    /*
        getTeacherName = (courseId) => {
            API.getTeacherName(courseId).then((name)=> this.setState({teacherName: name}));
        }
    
        getMaxSeats = (classroom) => {
            API.getMaxSeats(classroom).then((maxSeats) => this.setState({maxSeats: maxSeats}));
        }*/
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
                        <LectureList lecture={this.state.lectures} names={this.state.names} getCourseName={this.getCourseName} getTeacherName={this.getTeacherName} getMaxSeats={this.getMaxSeats} />
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
                        <strong>Data</strong>
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

                    <LectureItem key={l.lectureId} names={props.names} lecture={l} getCourseName={props.getCourseName} classroom={l.classroomId} getTeacherName={props.getTeacherName} getMaxSeats={props.getMaxSeats} />
                )


            }
        </ListGroup>

    );

}

function LectureItem(props) {
    let i = 0;
    //props.getCourseName(props.courseId);
    /*let teacherName = props.getTeacherName(props.courseId);
    let maxSeats = props.getMaxSeats(props.classroom);*/
    // let courseName = props.getCourseName(props.lecture.courseId);
    console.log("Prova");
    let name = props.names.map((n => console.log(n)));
    console.log(name);
    return (
        <ListGroup.Item className='border mt-1'>
            <Row className='justify-content-around'>
                <Col xs={1} className='text-center'>
                    {name}
                </Col>
                <Col xs={1} className='text-center'>
                    {}
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
                    {}
                </Col>
                <Col xs={1} className='text-center'>
                    <Button>Book</Button>
                </Col>
                <Col xs={1} className='text-center'>

                </Col>
            </Row>
        </ListGroup.Item>
    );
    //i++;
}



export default LectureListView;
