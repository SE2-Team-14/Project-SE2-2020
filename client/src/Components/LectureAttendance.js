import React from 'react';
import API from '../api/API';

import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from "react-bootstrap/ListGroup";

class LectureAttendance extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookedStudents: [],
            studentIds: [],
            presentStudentIds: [],
            courseName: null,
        }
    }

    componentDidMount() {
        let studentIds = [];
        let presentStudentIds = [];
        let courseName = null;
        API.getBookingsOfLecture(this.props.lecture.lectureId).then((bookings) => {
            bookings.map((book) => studentIds.push(book.studentId))
            bookings.map((book) => {
                if (book.present) {
                    presentStudentIds.push(book.studentId);
                }
            })
            API.getCoursesNames().then((courses) => {
                for (let course of courses) {
                    if (course.courseId === this.props.lecture.courseId) {
                        courseName = course.name;
                        break;
                    }
                }
                this.setState({
                    bookedStudents: bookings,
                    studentIds: studentIds,
                    presentStudentIds: presentStudentIds,
                    courseName: courseName
                })
            })

        })
    }

    recordPresence = (booking) => {
        let presentStudentIds = [...this.state.presentStudentIds];
        presentStudentIds.push(booking.studentId);
        booking.present = 1;
        API.recordAttendance(booking).then(() => {
            this.setState({ presentStudentIds: presentStudentIds })
        }).then((API.getBookingsOfLecture(this.props.lecture.lectureId).then((bookings) => {
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
        return (
            <>
                {(this.state.bookedStudents.length > 0) && <ListGroup>
                    <Row className='justify-content-around'>
                        <h4> Students booked for the lecture taking place today at {this.props.lecture.startingTime} - {this.props.lecture.endingTime} for the course:</h4>
                    </Row>
                    <Row className="justify-content-around">
                        <h4> {this.state.courseName}</h4>
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
                {(this.state.bookedStudents.length === 0) &&
                    <>
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                                <h4> There are no booked students for the lesson taking place today at {this.props.lecture.startingTime} - {this.props.lecture.endingTime} for the course:</h4>
                            </Col>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                                <h4> {this.state.courseName}, so it's not possible to record attendance.</h4>
                            </Col>
                        </Row>
                    </>}
            </>
        );
    }
}

export default LectureAttendance;