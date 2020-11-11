import React from 'react';
import Table from "react-bootstrap/Table";

import API from '../api/API';

class BookingTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enrolls: [],
        }
    }

    componentDidMount() {
        API.getEnrollments(this.props.course).then((e) => {
            this.setState({ enrolls: e })
        })
    }

    createRow = (enroll) => {
        return (

            <tr>
                <td> {enroll.studentId}</td>
                <td> {enroll.date}</td>
                <td> {enroll.startingTime}</td>
                <td> {enroll.endingTime}</td>
                <td> {enroll.classroom}</td>

            </tr>
        )
    }

    render() {
        return (
            <>
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
            </>
        )
    }
}

export default BookingTable;