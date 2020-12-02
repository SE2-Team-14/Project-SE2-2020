import React from 'react';
import { AuthContext } from '../auth/AuthContext'
import API from '../api/API';


import BookingTable from "./BookingTable"

class BookedStudentsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            courses: [],
            tables: [],
        }
    }

    /**
     * Obtains all courses taught by the logged in teacher by using their email.
     * After retrieving all courses creates an array of components BookingTable (one component per course): each component will render the booked students for all future lectures of the associated course
     */
    componentDidMount() {
        let tables = [];
        API.getCourses(this.props.email).then((c) => {
            let courses = [];
            c.map((course) => courses.push(course.name));
            this.setState({ courses: courses });
        }).then(() => {

            for (let i = 0; i < this.state.courses.length; i++) {
                tables.push(<BookingTable key={i} course={this.state.courses[i]}></BookingTable>)
            }
            this.setState({ tables: tables })
        })

    }

    /**
     * Renders the array of BookingTable components loaded before, showning all bookings for all courses of the teacher.
     */
    render() {
        return (
            <AuthContext.Consumer>
            {(context) => (
            <>
                {this.state.tables}
            </>
            )}
            </AuthContext.Consumer>
        );
    }
}

export default BookedStudentsList;