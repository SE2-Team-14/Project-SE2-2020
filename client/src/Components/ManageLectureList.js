import React from 'react';
import { ListGroup, Col, Row, Jumbotron, Button, Modal } from 'react-bootstrap';
import API from '../api/API';
const moment = require('moment');
//import Booking from '../api/booking';

class ManageLectureList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { lectures: [], bookings: [], showDelete: false, showDeleteSuccess: false, showDeleteError: false, showChange: false, showChangeError: false, showChangeSuccess: false, lecture: ''};
    }
    componentDidMount() {
        API.getTeacherLecturesList(this.props.id)
        .then((lectures) => this.setState({lectures: lectures}));
        API.getAllBookings().then((bookings) => this.setState({bookings: bookings}));
    }

    findCourseName = (courseId) => {
        let course = this.props.courses.find((c) => c.courseId == courseId);
        return course.name;
    }


    findMaxSeats = (classroomId) => {
        let classroom = this.props.classrooms.find((c) => c.classroom == classroomId);
        return classroom.maxNumberOfSeats;
    }

    handleDelete = (lecture) => {
        let deadline = moment().format("HH:mm");
        let startingTime = moment(lecture.startingTime, "HH:mm").subtract(1, "hour").format("HH:mm");
        let today = moment().format("DD/MM/YYYY");
        if(lecture.date > today){
            this.deleteLecture(lecture);
            this.deleteBookingByTeacher(lecture.lectureId);
            API.getTeacherLecturesList(this.props.id).then((lectures) => this.setState({lectures: lectures}));
        }else{
            if(startingTime < deadline){
                this.setState({showDelete: false, showDeleteError: true});
            }
            else{
                this.deleteLecture(lecture);
                this.deleteBookingByTeacher(lecture.lectureId);
                API.getTeacherLecturesList(this.props.id).then((lectures) => this.setState({lectures: lectures}));
            }
        }
        
    }

    handleChange = (lecture) => {
        let deadline = moment().format("HH:mm");
        let startingTime = moment(lecture.startingTime, "HH:mm").subtract(30, "minutes").format("HH:mm");
        let today = moment().format("DD/MM/YYYY");
        if(lecture.date > today){
            this.changeType(lecture);
            this.deleteBookingByTeacher(lecture.lectureId);
            API.getTeacherLecturesList(this.props.id).then((lectures) => this.setState({lectures: lectures}));
        }else {
            if(startingTime < deadline){
                this.setState({showChange: false, showChangeError: true});
            }
            else{
                this.changeType(lecture);
                this.deleteBookingByTeacher(lecture.lectureId);
                API.getTeacherLecturesList(this.props.id).then((lectures) => this.setState({lectures: lectures}));
            }
        }  
    }

    deleteLecture = (lecture) => {
        API.deleteLecture(lecture).then(() => API.getTeacherLecturesList(this.props.id).then((lectures) => this.setState({lectures: lectures, showDeleteSuccess: true, showDelete: false})));
        API.addCancelledLecture(lecture);
        API.getTeacherLecturesList(this.props.id).then((lectures) => this.setState({lectures: lectures}));
    }

    changeType = (lecture) => {
        API.changeLectureType(lecture).then(() => API.getTeacherLecturesList(this.props.id).then((lectures) => this.setState({lectures: lectures, showChangeSuccess: true, showChange: false})));
    }

    deleteBookingByTeacher = (lectureId) => {
        for(let b of this.state.bookings){
            if(b.lectureId == lectureId)
                API.deleteBookingByTeacher(lectureId);
        }
        
    }

    handleClickChange = (lecture) => {
        this.setState({showChange: true, lecture: lecture});
    }

    handleClickDelete = (lecture) => {
        this.setState({showDelete: true, lecture: lecture});
    }

    handleClose = () => {
        this.setState({showChange: false, showChangeSuccess: false, showChangeError: false, showDelete: false, showDeleteError: false, showDeleteSuccess: false});
    }

   
    render() {

        return (
            <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                <Row className='col-12 m-0 p-0'>
                    <Col>
                        <LectureListManage lecture={this.state.lectures} findCourseName={this.findCourseName}  findMaxSeats={this.findMaxSeats} handleClickChange={this.handleClickChange} handleClickDelete={this.handleClickDelete}/>
                    </Col>
                </Row>
                <Modal controlid='Delete' show={this.state.showDelete} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                       <Modal.Title>Confirm deleting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to confirm your deleting?</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={()=>this.handleDelete(this.state.lecture)}>Yes</Button>
                        <Button variant='secondary' onClick={this.handleClose}>No</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='Change' show={this.state.showChange} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm change</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to change your type of lecture (from in presence to virtual)?</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={()=>this.handleChange(this.state.lecture)}>Yes</Button>
                        <Button variant='secondary' onClick={this.handleClose}>No</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='DeleteSuccess' show={this.state.showDeleteSuccess} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                       <Modal.Title>Confirm deleting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Congrats, your lecture is delete! A mail to the students is sent!</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={()=>this.handleClose()}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='DeleteError' show={this.state.showDeleteError} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                       <Modal.Title>ERROR!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You can't delete this lesson now! Time is expire!</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={()=>this.handleClose()}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='ChangeSuccess' show={this.state.showChangeSuccess} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                       <Modal.Title>Confirm changing</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Your lesson has been changed. Now is a virtual lecture!</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={()=>this.handleClose()}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal controlid='ChangeError' show={this.state.showChangeError} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                       <Modal.Title>ERROR!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You can't change this lesson now! Time is expire</Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={()=>this.handleClose()}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Jumbotron>

        );
    }
}

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

                    <LectureItemManage key={l.lectureId} lecture={l} findCourseName = {props.findCourseName} findMaxSeats={props.findMaxSeats} handleClickChange={props.handleClickChange} handleClickDelete={props.handleClickDelete}/>
                )


            }
        </ListGroup>

    );

}

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
                    {(props.lecture.inPresence == true || props.lecture.inPresence ==1) &&
                    <>
                         {props.lecture.classroomId}
                    </>}
                    {(props.lecture.inPresence == false || props.lecture.inPresence == 0) &&
                    <>
                         Virtual Classroom
                    </>}
                </Col>
                <Col xs={1} className='text-center'>
                    {(props.lecture.numberOfSeats && (props.lecture.inPresence == true || props.lecture.inPresence ==1)) &&
                        <>
                        {props.lecture.numberOfSeats}/{maxSeats}
                        </>
                    } 
                    {(!props.lecture.numberOfSeats && (props.lecture.inPresence == true || props.lecture.inPresence ==1)) &&
                        <>
                        {0}/{maxSeats}
                        </>
                    }
                    {(props.lecture.inPresence == false || props.lecture.inPresence == 0 ) &&
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
