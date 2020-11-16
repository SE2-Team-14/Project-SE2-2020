import React from 'react';

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

    componentDidMount() {
        let tables = [];
        API.getCourses(this.props.email).then((c) => {
            let courses = [];
            c.map((course) => courses.push(course.name));
            this.setState({ courses: courses });
        }).then(() => {

            for (let i = 0; i < this.state.courses.length; i++) {
                tables.push(<BookingTable course={this.state.courses[i]}></BookingTable>)
            }
            this.setState({ tables: tables })
        })

    }

    render() {
        return (
            <>
                {this.state.tables}
            </>
        );
    }
}

export default BookedStudentsList;