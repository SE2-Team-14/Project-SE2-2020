import React from 'react';
import API from '../api/API';

import Dropdown from 'react-bootstrap/Dropdown';
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from "react-bootstrap/Jumbotron";
import {
    BarChart, Bar, /*Cell,*/ XAxis, YAxis, CartesianGrid, Tooltip, /*Label,*/
} from 'recharts';
import { AuthContext } from '../auth/AuthContext';
import { Redirect } from 'react-router-dom';


class TeacherStatsViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: [],
            courses: [],
            selectedCourse: null,
            mode: null,
            lectures: [],
            selectedDate: null,
            lectureTime: null,
            cancelledStats: [],
            maxStat: 0,
            stats2: [
                { name: "C1", bookings: 10, date: "today" },
                { name: "C2", bookings: 5, date: "today" }
            ]
        }
    }

    /**
     * Retrieves the list of all courses taught by the teacher with the associated email.
     */
    componentDidMount() {
        API.getCourses(this.props.email).then((courses) => {
            this.setState({ courses: courses })
        })
    }

    /**
     * Changes the state to remember the last selected course. 
     * Resets all other parameters to have a fresh start from previous actions.
     * @param course a Course object containing information about the selected course
     */
    onSelectCourse = (course) => {
        this.setState({ selectedCourse: course, lectures: [], mode: null, selectedDate: null, stats: [], cancelledStats: [] })
    }

    /**
     * Sets the mode chosen by the teacher to view statistics, with different behaviors:
     *  - lecture mode: calls the API that retrieves all past lectures of the course, resets already registered information about statistics 
     *  - month mode: calls the API that retrieves the statistics for the specified mode(amount of bookings made in each separate month) and saves them, resets already registered information about lectures chosen before
     *  - week mode: calls the API that retrieves the statistics for the specified mode(amount of bookings made in each separate week, espressed as an interval of dates in format DD/MM/YYYY, Monday to Sunday) and saves them, resets already registered information about lectures chosen before
     *  - total mode: calls the API that retrieves the statistics for the specified mode(amount of total bookings made for each separate lecture) and saves them, resets already registered information about lectures chosen before
     *  - cancelled mode: calls the API that retrieves the statistics about cancelled lectures(amount of cancelled bookings for each separate lecture) and saves them, resets already registered information about lectures chosen before
     * All modes except the lecture one also calculate the maximum value for each statistic and save it in the state, to put it as the maximum value that can be shown in the graph
     * @param mode a string containing the mode chosen by the teacher
     */
    chooseMode = (mode) => {
        this.setState({ mode: mode })
        if (mode === "lecture") {
            API.getPastLectures(this.state.selectedCourse).then((lectures) => {
                this.setState({ lectures: lectures, stats: [], cancelledStats: [] })
            })
        } else if (mode === "month" || mode === "week" || mode === "total") {
            API.getStatistics(null, mode, this.state.selectedCourse).then((stats) => {
                let max = 0;
                let num = 0;
                for (let i = 0; i < stats.length; i++) {
                    num = stats[i].bookings;
                    if (num > max) {
                        max = num;
                    }
                }
                this.setState({ stats: stats, selectedDate: null, lectureTime: null, cancelledStats: [], maxStat: max })
            })
        } else if (mode === "cancelled") {
            API.getCancelledBookingsStats(this.state.selectedCourse).then((stats) => {
                let max = 0;
                let num = 0;
                for (let i = 0; i < stats.length; i++) {
                    num = stats[i].cancellations;
                    if (num > max) {
                        max = num;
                    }
                }
                this.setState({ stats: [], selectedDate: null, lectureTime: null, cancelledStats: stats, maxStat: max })
            })
        }
    }

    /**
     * Called when the teacher chooses a lecture while in lecture mode.
     * Calls the API that retrieves statistics in the specified mode (amount of bookings made in separate days for the lecture that took part in the chosen date) and saves them.
     * Calculates the maximum amount of the statistics and saves it in the state to have it as the maximum amount in the graph; also saves the starting and ending time of the lecture in format HH:MM-HH:MM
     * @param lecture a Lecture object containing information about the lecture chosen in the dropdown menu
     */
    onSelectLecture = (lecture) => {
        let lectureTime = lecture.startingTime + "-" + lecture.endingTime;
        API.getStatistics(lecture.date, this.state.mode, this.state.selectedCourse).then((stats) => {
            let max = 0;
            let num = 0;
            for (let i = 0; i < stats.length; i++) {
                num = stats[i].bookings;
                if (num > max) {
                    max = num;
                }
            }
            this.setState({ stats: stats, selectedDate: lecture.date, lectureTime: lectureTime, maxStat: max })
        })
    }

    /**
     * Renders a dropdown button that allows a teacher to select, among all the courses taught by him, one he wishes to see statistics of.
     * After choosing a course the teacher can choose with buttons the mode according to which he wants to see stats (single lecture, by week, by month, total bookings divided by lecture, cancelled bookings per lecture)
     * Choosing lecture mode renders another dropdown menu with all past lectures of the course.
     * After choosing any lecture (or a different mode) a bar graph is rendered, showing all bookings according to the chosen mode.
     */
    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {(context.authErr || !context.authUser) && <Redirect to="/login"></Redirect>}
                        <Jumbotron>
                            <Row className="justify-content-md-center">
                                <Col md="auto"></Col>
                                <Col md="auto" className="below-nav">
                                    {(this.state.courses.length > 0) && <Dropdown>
                                        <Dropdown.Toggle variant="outline-success" id="dropdown-basic" title={this.state.selectedCourse}>
                                            Choose the Course you want to view statistics of
                    </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {this.state.courses.map((course) => (<Dropdown.Item onClick={() => this.onSelectCourse(course.name)} key={course.name}>{course.name}</Dropdown.Item>))}
                                        </Dropdown.Menu>
                                    </Dropdown>}

                                </Col>
                                <Col md="auto"></Col>
                            </Row>
                            <Row className="h-75 d-inline-block">{""}</Row>
                            <Row className="justify-content-md-center">
                                {
                                    (this.state.courses.length > 0 && this.state.selectedCourse !== null) && <h4> Statistics for the course {this.state.selectedCourse}</h4>
                                }
                            </Row>
                            <Row className="h-75 d-inline-block">{""}</Row>
                            <Row className="justify-content-md-center">
                                <Col md="auto">
                                    {this.state.selectedCourse != null && <Button variant="outline-info" active={this.state.mode == 'lecture'} onClick={() => this.chooseMode("lecture")}> View Bookings of Single Lecture </Button>}
                                </Col>
                                <Col md="auto">
                                    {this.state.selectedCourse != null && <Button variant="outline-info" active={this.state.mode == 'week'} onClick={() => this.chooseMode("week")}> View Bookings by Week </Button>}
                                </Col>
                                <Col md="auto">
                                    {this.state.selectedCourse != null && <Button variant="outline-info" active={this.state.mode == 'month'} onClick={() => this.chooseMode("month")}> View Bookings by Month </Button>}
                                </Col>
                                <Col md="auto">
                                    {this.state.selectedCourse != null && <Button variant="outline-info" active={this.state.mode == 'total'} onClick={() => this.chooseMode("total")}> View Total Bookings </Button>}
                                </Col>
                                <Col md="auto">
                                    {this.state.selectedCourse != null && <Button variant="outline-info" active={this.state.mode == 'cancelled'} onClick={() => this.chooseMode("cancelled")}> View Cancelled Bookings </Button>}
                                </Col>
                            </Row>
                            <Row className="h-75 d-inline-block">{""}</Row>
                            <Row className="justify-content-md-center">

                                {(this.state.mode === "lecture" && this.state.lectures.length > 0) && <Dropdown>
                                    <Dropdown.Toggle variant="outline-info" id="dropdown-basic" title={this.state.selectedCourse}>
                                        Choose the lecture you want to view statistics of
                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {this.state.lectures.map((lecture) => (<Dropdown.Item onClick={() => this.onSelectLecture(lecture)} key={lecture.date}>{lecture.date} {lecture.startingTime} - {lecture.endingTime}</Dropdown.Item>))}
                                    </Dropdown.Menu>
                                </Dropdown>}

                            </Row>
                            <Row className="h-75 d-inline-block">{""}</Row>
                            <Row className="justify-content-md-center align-items-center">
                                {(this.state.stats.length > 0 && this.state.mode === "lecture") &&
                                    <>
                                        <Col md="auto" className="align-items-center">
                                            <h4>Bookings for the lecture {this.state.selectedDate} {this.state.lectureTime}</h4>
                                        </Col>
                                        <Col md="auto">
                                            <BarChart
                                                width={500}
                                                height={400}
                                                data={this.state.stats}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />

                                                <XAxis dataKey="date" height={50}>
                                                </XAxis>
                                                <YAxis allowDecimals={false} domain={[0, this.state.maxStat]} />
                                                <Tooltip />
                                                <Bar dataKey="bookings" fill="#9FFEF7" />
                                            </BarChart>
                                        </Col>
                                    </>}
                                {(this.state.stats.length === 0 && this.state.selectedDate != null) && <h4> There are no bookings for the lecture {this.state.selectedDate} {this.state.lectureTime}, so no statistics are available.</h4>}
                                {(this.state.mode === "month" && this.state.stats.length > 0) &&
                                    <>
                                        <Col md="auto">
                                            <h4>Bookings divided by month</h4>
                                        </Col>
                                        <Col md="auto">
                                            <BarChart
                                                width={500}
                                                height={400}
                                                data={this.state.stats}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />

                                                <XAxis dataKey="month" height={50}>
                                                </XAxis>
                                                <YAxis allowDecimals={false} domain={[0, this.state.maxStat]} />
                                                <Tooltip />
                                                <Bar dataKey="bookings" fill="#FEFB94" />
                                            </BarChart>
                                        </Col>
                                    </>}
                                {(this.state.mode === "week" && this.state.stats.length > 0) &&
                                    <>
                                        <Col md="auto">
                                            <h4>Bookings divided by week</h4>
                                        </Col>
                                        <Col md="auto">
                                            <BarChart
                                                width={500}
                                                height={400}
                                                data={this.state.stats}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />

                                                <XAxis dataKey="week" height={50}>
                                                </XAxis>
                                                <YAxis allowDecimals={false} domain={[0, this.state.maxStat]} />
                                                <Tooltip />
                                                <Bar dataKey="bookings" fill="#C2FE9F" />
                                            </BarChart>
                                        </Col>
                                    </>}
                                {(this.state.mode === "total" && this.state.stats.length > 0) &&
                                    <>
                                        <Col md="auto">
                                            <h4>Bookings divided by single lecture</h4>
                                        </Col>
                                        <Col md="auto">
                                            <BarChart
                                                width={500}
                                                height={400}
                                                data={this.state.stats}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />

                                                <XAxis dataKey="date" height={50}>
                                                </XAxis>
                                                <YAxis allowDecimals={false} domain={[0, this.state.maxStat]} />
                                                <Tooltip />
                                                <Bar dataKey="bookings" fill="#FF756A" />
                                            </BarChart>
                                        </Col>
                                    </>}
                                {(this.state.mode === "cancelled" && this.state.cancelledStats.length > 0) &&
                                    <>
                                        <Col md="auto">
                                            <h4>Cancelled bookings divided by single lecture</h4>
                                        </Col>
                                        <Col md="auto">
                                            <BarChart
                                                width={500}
                                                height={400}
                                                data={this.state.cancelledStats}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />

                                                <XAxis dataKey="date" height={50}>
                                                </XAxis>
                                                <YAxis allowDecimals={false} domain={[0, this.state.maxStat]} />
                                                <Tooltip />
                                                <Bar dataKey="cancellations" fill="#736F70" />
                                            </BarChart>
                                        </Col>
                                    </>}
                                {((this.state.mode === "week" || this.state.mode === "month" || this.state.mode === "total") && this.state.stats.length == 0) && <h4> There are no statistics available for the course {this.state.selectedCourse}</h4>}
                                {(this.state.mode === "lecture" && this.state.lectures.length == 0) && <h4> There are no in-presence lectures registered for the course {this.state.selectedCourse}</h4>}
                                {(this.state.mode === "cancelled" && this.state.cancelledStats == 0) && <h4> There are no cancelled bookings registered. </h4>}

                            </Row>

                        </Jumbotron>
                    </>)}
            </AuthContext.Consumer>)
    }
}

export default TeacherStatsViewer;