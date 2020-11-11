import React from 'react';

import API from '../api/API';

import BookingTable from "./BookingTable"

class BookedStudentsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            courses: [],
            students: [[{ id: "s111", name: "Giova", surname: "CB", date: "13/11/2020", time: "13:00" }, { id: "s222", name: "Tommy", surname: "Guaste", date: "13/11/2020", time: "13:00" }], []],
            tables: [],
        }
    }

    componentDidMount() {
        let students = [];
        let tables = [];
        API.getCourses("d123@polito.it").then((c) => {
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