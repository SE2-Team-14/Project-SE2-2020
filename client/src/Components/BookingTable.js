import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import API from '../api/API';

class BookingTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enrolls: [],
        }
    }

    componentDidMount() {
        API.getBookedStudents(this.props.course).then((e) => {
            this.setState({ enrolls: e })
        })
    }



    /*createRow = (enroll) => {
        console.log(enroll)
        return (

            <tr>
                <td> {enroll.id}</td>
                <td> {enroll.date}</td>
                <td> {enroll.startingTime}</td>
                <td> {enroll.endingTime}</td>
                <td> {enroll.classroomId}</td>

            </tr>
        )
    }
    <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                    {this.state.enrolls.length === 0 && <h4> There are no bookings yet for the course {this.props.course}</h4>}
                    {this.state.enrolls.length > 0 && <h4> Bookings for the course {this.props.course}</h4>}
                    {this.state.enrolls.length > 0 && <Table bordered striped={true} size="sm">
                        <thead>
                            <tr>
                                <th> Student ID </th>
                                <th> Lesson Date </th>
                                <th> Starting Time </th>
                                <th> Ending Time </th>
                                <th> Classroom </th>
                            </tr>
                        </thead>
                        <tbody>{this.state.enrolls.map((e) => this.createRow(e))}</tbody>

                    </Table>}
                </Jumbotron>*/


    TableItem = (enroll) => {

        return (
            <ListGroup.Item className='border mt-1'>
                <Row className='justify-content-around'>
                    <Col xs={1} className='text-center'>
                        {enroll.date}
                    </Col>
                    <Col xs={1} className='text-center'>
                        {enroll.startingTime}
                    </Col>
                    <Col xs={1} className='text-center'>
                        {enroll.endingTime}
                    </Col>
                    <Col xs={1} className='text-center'>
                        {enroll.classroomId}
                    </Col>
                    <Col xs={1} className='text-center'>
                        {enroll.studentId}
                    </Col>
                </Row>
            </ListGroup.Item>
        );
    }

    render() {
        return (
            <>{this.state.enrolls.length === 0 && <ListGroup>
                <Row className='justify-content-around'>
                    <h1>There are no bookings yet for the course {this.props.course}</h1>
                </Row>
            </ListGroup>}
                {this.state.enrolls.length > 0 && <ListGroup>
                    <Row className='justify-content-around'>
                        <h1>Booked Students for the course {this.props.course}</h1>
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
                        this.state.enrolls.map((e) =>

                            this.TableItem(e)
                        )


                    }
                </ListGroup>}
            </>
        )
    }
}

export default BookingTable;