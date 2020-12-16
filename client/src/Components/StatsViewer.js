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


class StatsViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: [],
            courses: [],
            selectedCourse: null,
            selectedCourseName: null,
            mode: "start",
            lectures: [],
            selectedDate: null,
            lectureTime: null,
            cancelledStats: [],
            maxStat: 0,
            noBookings: true,
            noCancelledLectures: true,
            teacherName: null,
            teacherSurname: null,
        }
    }

    /**
     * TODO
     * Dropdown corsi scorribile internamente perchè così com'è non si può vedere
     */

    /**
     * Retrieves the list of all courses taught by the teacher with the associated email.
     */
    componentDidMount() {
        if (this.props.role === "Teacher") {
            API.getCourses(this.props.email).then((courses) => {
                this.setState({ courses: courses })
            }).then(() => {
                API.getTeacherCoursesStatistics(this.props.email).then((stats) => {
                    let noBookings = stats[0].name === null;
                    this.setState({ stats: stats, noBookings: noBookings })
                })
            })
        } else if (this.props.role === "Manager") {
            API.getAllCoursesStatistics().then((stats) => {
                let newStats = [];
                stats.map((stat) => newStats.push({ total: stat.total, name: stat.courseName + " - " + stat.name + " " + stat.surname }))
                let noBookings = stats[0].name === null;
                this.setState({ stats: newStats, noBookings: noBookings })
            }).then(() => API.getCoursesAndTeachers().then((courses) => {
                let newCourses = [];
                courses.map((course) => newCourses.push({ name: course.courseName + " - " + course.name + " " + course.surname, courseId: course.courseId }));
                this.setState({ courses: newCourses })
            })).then(() => API.getCancelledLecturesStats().then((stats) => {
                let noCancelledLectures = stats.length === 0;
                this.setState({ noCancelledLectures: noCancelledLectures })
            }))
        }
    }

    /**
     * Changes the state to remember the last selected course. 
     * Resets all other parameters to have a fresh start from previous actions.
     * @param course a Course object containing information about the selected course
     */
    onSelectCourse = (course) => {
        let newCourse = null;
        let teacherName = null;
        let teacher = null;
        let teacherSurname = null;
        if (this.props.role === "Manager") {
            let pos = course.indexOf("-");
            newCourse = course.slice(0, pos - 1);
            teacher = course.slice(pos + 2, course.length);
            let pos2 = teacher.indexOf(" ");
            teacherName = teacher.slice(0, pos2);
            teacherSurname = teacher.slice(pos2 + 1, teacher.length);
        }
        this.setState({ selectedCourse: course, selectedCourseName: newCourse, lectures: [], mode: null, selectedDate: null, stats: [], cancelledStats: [], teacherName: teacherName, teacherSurname: teacherSurname })
    }

    /**
     * Sets the mode chosen by the teacher/manager to view statistics, with different behaviors:
     *  - lecture mode: calls the API that retrieves all past lectures of the course, resets already registered information about statistics 
     *  - month mode: calls the API that retrieves the statistics for the specified mode(amount of bookings made in each separate month) and saves them, resets already registered information about lectures chosen before
     *  - week mode: calls the API that retrieves the statistics for the specified mode(amount of bookings made in each separate week, espressed as an interval of dates in format DD/MM/YYYY, Monday to Sunday) and saves them, resets already registered information about lectures chosen before
     *  - total mode: calls the API that retrieves the statistics for the specified mode(amount of total bookings made for each separate lecture) and saves them, resets already registered information about lectures chosen before
     *  - cancelled mode: calls the API that retrieves the statistics about cancelled lectures(amount of cancelled bookings for each separate lecture) and saves them, resets already registered information about lectures chosen before
     *  - start mode: calls the API that retrieves the statistics about total bookings made for all courses of the teacher (all courses if called by the manager)
     *  - attendance mode: works the same as lecture mode
     * All modes except the lecture one also calculate the maximum value for each statistic and save it in the state, to put it as the maximum value that can be shown in the graph
     * @param mode a string containing the mode chosen by the teacher
     */
    chooseMode = (mode) => {
        this.setState({ mode: mode })
        if (this.props.role === "Teacher") {
            if (mode === "lecture" || mode === "attendance") {
                API.getPastLectures(this.state.selectedCourse, this.props.email, this.props.role, null, null).then((lectures) => {
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
            } else if (mode === "start") {
                API.getTeacherCoursesStatistics(this.props.email).then((stats) => {
                    let max = 0;
                    let num = 0;
                    for (let i = 0; i < stats.length; i++) {
                        num = stats[i].total;
                        if (num > max) {
                            max = num;
                        }
                    }
                    this.setState({ stats: stats, selectedDate: null, lectureTime: null, cancelledStats: [], maxStat: max, selectedCourse: null, })
                })
            }
        } else if (this.props.role === "Manager") {
            if (mode === "lecture") {//next
                API.getPastLectures(this.state.selectedCourseName, null, this.props.role, this.state.teacherName, this.state.teacherSurname).then((lectures) => {
                    this.setState({ lectures: lectures, stats: [], cancelledStats: [] })
                })
            } else if (mode === "month" || mode === "week" || mode === "total" || mode === "attendance") {
                API.getStatistics(null, mode, this.state.selectedCourseName).then((stats) => {
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
                API.getCancelledBookingsStats(this.state.selectedCourseName).then((stats) => {
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
            } else if (mode === "start") {

                API.getAllCoursesStatistics().then((stats) => {
                    let max = 0;
                    let num = 0;
                    for (let i = 0; i < stats.length; i++) {
                        num = stats[i].total;
                        if (num > max) {
                            max = num;
                        }
                    }
                    let newStats = [];
                    stats.map((stat) => newStats.push({ total: stat.total, name: stat.courseName + " - " + stat.name + " " + stat.surname }))
                    this.setState({ stats: newStats, selectedDate: null, lectureTime: null, cancelledStats: [], maxStat: max, selectedCourse: null, })
                })
            } else if (mode === "cancelledLectures") {
                API.getCancelledLecturesStats().then((stats) => {
                    let max = 0;
                    let num = 0;
                    for (let i = 0; i < stats.length; i++) {
                        num = stats[i].cancellations;
                        if (num > max) {
                            max = num;
                        }
                    }
                    let newStats = [];
                    stats.map((stat) => newStats.push({ cancellations: stat.cancellations, name: stat.courseName + " - " + stat.name + " " + stat.surname }))
                    this.setState({ stats: newStats, selectedDate: null, lectureTime: null, cancelledStats: [], maxStat: max, selectedCourse: null })
                })
            }
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
        if (this.props.role === "Teacher") {
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
        } else if (this.props.role === "Manager") {
            API.getStatistics(lecture.date, this.state.mode, this.state.selectedCourseName).then((stats) => {
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
                                <Col md="auto">
                                    {(this.state.courses.length > 0 && !this.state.noBookings) && <Dropdown>
                                        <Dropdown.Toggle variant="outline-success" id="dropdown-basic" title={this.state.selectedCourse}>
                                            Choose the Course you want to view statistics of
                    </Dropdown.Toggle>
                                        <Dropdown.Menu className="dropdown-menu pre-scrollable" style={{ overflowY: 'scroll', maxHeight: "200px" }}>
                                            {this.state.courses.map((course) => (<Dropdown.Item onClick={() => this.onSelectCourse(course.name)} key={course.courseId}>{course.name}</Dropdown.Item>))}
                                        </Dropdown.Menu>
                                    </Dropdown>}
                                    {(this.state.mode === "start" && this.state.noBookings) && <h4> There are no statistics about bookings available yet.</h4>}
                                </Col>
                                <Col md="auto"> {(!this.state.noBookings) && <Button variant="outline-info" active={this.state.mode == "start"} onClick={() => this.chooseMode("start")} > View Total Bookings of all Courses </Button>}</Col>
                                {(this.props.role === "Manager") && <Col md="auto">
                                    <Button variant="outline-info" active={this.state.mode == "cancelledLectures"} onClick={() => this.chooseMode("cancelledLectures")} > View Cancelled Lectures of all Courses </Button>
                                </Col>}
                            </Row>
                            <Row className="h-75 d-inline-block">{""}</Row>
                            <Row className="justify-content-md-center">
                                {
                                    (this.state.courses.length > 0 && this.state.selectedCourse !== null) && <h4> Statistics for the course {this.state.selectedCourse}</h4>
                                }
                            </Row>
                            {(this.props.role === "Manager") && <Row className="justify-content-md-center align-items-center">
                                {(this.state.noCancelledLectures && this.state.mode === "cancelledLectures") && <Col md="auto">
                                    <h4> There are no statistics about cancelled lectures available yet.</h4>
                                </Col>}

                                {(!this.state.noCancelledLectures && this.state.mode === "cancelledLectures") &&
                                    <>
                                        <Col md="auto" className="align-items-center">
                                            <h4> Cancelled lectures for each course.</h4>
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

                                                <XAxis dataKey="name" height={50}>
                                                </XAxis>
                                                <YAxis allowDecimals={false} domain={[0, this.state.maxStat]} />
                                                <Tooltip itemStyle={{ color: "black" }} />
                                                <Bar dataKey="cancellations" fill="#A78C5B" />
                                            </BarChart>
                                        </Col>
                                    </>}
                            </Row>}
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
                                <Col md="auto">
                                    {(this.state.selectedCourse != null && this.props.role === "Manager") && <Button variant="outline-info" active={this.state.mode == "attendance"} onClick={() => this.chooseMode("attendance")}> View Attendance of All Lectures </Button>}
                                </Col>
                            </Row>
                            <Row className="h-75 d-inline-block">{""}</Row>
                            <Row className="justify-content-md-center">

                                {(this.state.mode === "lecture" && this.state.lectures.length > 0) && <Dropdown>
                                    <Dropdown.Toggle variant="outline-info" id="dropdown-basic" title={this.state.selectedCourse}>
                                        Choose the lecture you want to view statistics of
                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="dropdown-menu pre-scrollable" style={{ overflowY: 'scroll', maxHeight: "10px" }}>
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
                                                <Tooltip itemStyle={{ color: "black" }} />
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
                                                <Tooltip itemStyle={{ color: "black" }} />
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
                                                <Tooltip itemStyle={{ color: "black" }} />
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
                                                <Tooltip itemStyle={{ color: "black" }} />
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
                                                <Tooltip itemStyle={{ color: "black" }} />
                                                <Bar dataKey="cancellations" fill="#736F70" />
                                            </BarChart>
                                        </Col>
                                    </>}
                                {(this.state.mode === "start" && !this.state.noBookings) &&
                                    <>
                                        <Col md="auto">
                                            <h4> Total bookings made for each course </h4>
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

                                                <XAxis dataKey="name" height={50}>
                                                </XAxis>
                                                <YAxis allowDecimals={false} domain={[0, this.state.maxStat]} />
                                                <Tooltip itemStyle={{ color: "black" }} />
                                                <Bar dataKey="total" fill="#D469FF" />
                                            </BarChart>
                                        </Col>
                                    </>}
                                {(this.state.mode === "attendance" && this.state.stats.length > 0) &&
                                    <>
                                        <Col md="auto">
                                            <h4>Attendance of students divided by single lecture</h4>
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
                                                <Tooltip itemStyle={{ color: "black" }} />
                                                <Bar dataKey="presences" fill="#FFAF69" />
                                            </BarChart>
                                        </Col>
                                    </>
                                }
                                {((this.state.mode === "week" || this.state.mode === "month" || this.state.mode === "total") && this.state.stats.length == 0) && <h4> There are no statistics available for the course {this.state.selectedCourse}</h4>}
                                {((this.state.mode === "lecture") && this.state.lectures.length == 0) && <h4> There are no in-presence lectures registered for the course {this.state.selectedCourse}</h4>}
                                {(this.state.mode === "cancelled" && this.state.cancelledStats == 0) && <h4> There are no cancelled bookings registered. </h4>}
                                {(this.state.mode === "attendance" && this.state.stats.length === 0) && <h4> There are no statistics available about attendance for the course {this.state.selectedCourse}</h4>}

                            </Row>

                        </Jumbotron>
                    </>)}
            </AuthContext.Consumer>)
    }
}

export default StatsViewer;