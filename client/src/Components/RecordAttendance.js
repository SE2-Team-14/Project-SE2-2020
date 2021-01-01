import React from 'react';
import API from '../api/API';

import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from "react-bootstrap/Jumbotron";
import ListGroup from "react-bootstrap/ListGroup";

import { AuthContext } from '../auth/AuthContext';
import { Redirect } from 'react-router-dom';

const moment = require('moment');

class RecordAttendance extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentLecture: null,
            lectureToday: false,
            today: null,
            bookedStudents: [],
            studentIds: [],
            presentStudentIds: [],
        }
    }

    componentDidMount() {
        API.getCurrentLecture(this.props.id).then((lecture) => {
            let lectureToday = true;
            let today = moment().format("DD/MM/YYYY");
            let studentIds = [];
            let presentStudentIds = [...this.state.presentStudentIds]
            if (lecture === 0) {
                lectureToday = false;
                this.setState({ today: today })
            } else {
                API.getBookingsOfLecture(lecture.lectureId).then((bookings) => {
                    bookings.map((book) => studentIds.push(book.studentId))
                    bookings.map((book) => {
                        if (book.present) {
                            presentStudentIds.push(book.studentId);
                        }
                    })
                    this.setState({
                        currentLecture: lecture,
                        lectureToday: lectureToday,
                        today: today,
                        bookedStudents: bookings,
                        studentIds: studentIds,
                        presentStudentIds: presentStudentIds
                    })

                })
            }

        });
    }

    recordPresence = (booking) => {
        let presentStudentIds = [...this.state.presentStudentIds];
        presentStudentIds.push(booking.studentId);
        booking.present = 1;
        API.recordAttendance(booking).then(() => {
            this.setState({ presentStudentIds: presentStudentIds })
        }).then((API.getBookingsOfLecture(this.state.currentLecture.lectureId).then((bookings) => {
            this.setState({

                bookedStudents: bookings,
            })
        })))

    }

    isAbsent = (studentId) => {
        let presentStudentIds = [...this.state.presentStudentIds];
        let index = presentStudentIds.indexOf(studentId);
        return (index === -1);
    }

    TableItem = (booking) => {
        return (
            <ListGroup.Item className="border mt-1">
                <Row className="justify-content-around">
                    <Col className="text-center">
                        {booking.studentId}
                    </Col>
                    <Col className="text-center">
                        {(this.isAbsent(booking.studentId)) && <Button variant="success" onClick={() => this.recordPresence(booking)} /*disabled={() => this.isPresent(booking.studentId)}*/ > Record as Present</Button>}
                        {(!this.isAbsent(booking.studentId)) && <h4> Present</h4>}
                    </Col>
                </Row>
            </ListGroup.Item>
        )
    }

    render() {
        return <AuthContext.Consumer>
            {(context) => (
                <>
                    {(context.authErr || !context.authUser) && <Redirect to="/login"></Redirect>}
                    <Jumbotron style={{ background: "none" }}>
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                                <h4> Record Attendance for the day {this.state.today}</h4>
                            </Col>
                        </Row>
                        <Row className="h-75 d-inline-block">{""}</Row>
                        <Row className="justify-content-md-center">
                            {(!this.state.lectureToday) && <Col md="auto">
                                <h4> There isn't a lecture in presence taking place right now, so attendance can't be recorded.</h4>
                            </Col>}

                        </Row>
                        {(this.state.lectureToday && this.state.bookedStudents.length > 0) && <ListGroup>
                            <Row className='justify-content-around'>
                                <h4> Students booked for the lecture taking place today at {this.state.currentLecture.startingTime} - {this.state.currentLecture.endingTime} </h4>
                            </Row>
                            <ListGroup.Item className="border">
                                <Row className="justify-content-around">
                                    <Col className="text-center">
                                        <strong> Student ID</strong>
                                    </Col>
                                    <Col className="text-center"></Col>
                                </Row>
                            </ListGroup.Item>
                            {
                                this.state.bookedStudents.map((b) => this.TableItem(b))
                            }
                        </ListGroup>}
                        {(this.state.lectureToday && this.state.bookedStudents.length === 0) && <Row className="justify-content-md-center">
                            <Col md="auto">
                                <h4> There are no booked students for the lesson taking place now, so it's not possible to record attendance.</h4>
                            </Col>
                        </Row>}
                    </Jumbotron>
                </>
            )}
        </AuthContext.Consumer>
    }
}

export default RecordAttendance;