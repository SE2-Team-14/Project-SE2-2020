import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron'
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import API from '../api/API';

class BookingTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
        }
    }

    /**
     * Obtains all booked students for all future lectures for the course received as prop by the father component BookedStudentsList
     */
    componentDidMount() {
        API.getBookedStudents(this.props.course).then((b) => {
            this.setState({ bookings: b })
        })
    }

    /**
     * Renders a new row for the list of bookings.
     * Receives a booking from all the future bookings of the course and renders date, starting hour, ending hour and classroom of the lecture and identifier of the booked student for the lecture
     */
    TableItem = (booking) => {

        return (
            <ListGroup.Item className='border mt-1'>
                <Row className='justify-content-around'>
                    <Col xs={1} className='text-center'>
                        {booking.date}
                    </Col>
                    <Col xs={1} className='text-center'>
                        {booking.startingTime}
                    </Col>
                    <Col xs={1} className='text-center'>
                        {booking.endingTime}
                    </Col>
                    <Col xs={1} className='text-center'>
                        {booking.classroomId}
                    </Col>
                    <Col xs={1} className='text-center'>
                        {booking.studentId}
                    </Col>
                </Row>
            </ListGroup.Item>
        );
    }

    /**
     * Renders all booked students for all future lectures in the related course with a list showing date, starting time, ending time and classroom of every lecture and identifier of the booked student.
     * If no future bookings are available yet (because there are no lectures or no booked students) a message is shown instead of an empty page or an empty list.
     */
    render() {
        return (
            <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                {this.state.bookings.length === 0 && <ListGroup>
                <Row className='justify-content-around'>
                    <h4>There are no bookings yet for future lectures for the course {this.props.course}</h4>
                </Row>
            </ListGroup>}
                {this.state.bookings.length > 0 && <ListGroup>
                    <Row className='justify-content-around'>
                        <h4>Booked Students for all future lectures for the course {this.props.course} (N° {this.state.bookings.length})</h4>
                    </Row>
                    <ListGroup.Item className='border'>
                        <Row className='justify-content-around'>
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
                                <strong>Student ID</strong>
                            </Col>
                        </Row>

                    </ListGroup.Item>
                    {
                        this.state.bookings.map((e) =>

                            this.TableItem(e)
                        )


                    }
                </ListGroup>}
            </Jumbotron>
        )
    }
}

export default BookingTable;