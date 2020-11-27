import React from 'react';
import API from '../api/API';

import Dropdown from 'react-bootstrap/Dropdown';
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from "react-bootstrap/Jumbotron"

import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label,
} from 'recharts';

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
        }
    }

    componentDidMount() {
        API.getCourses(this.props.email).then((courses) => {
            this.setState({ courses: courses })
        })
    }

    onSelectCourse = (course) => {
        this.setState({ selectedCourse: course, lectures: [], mode: null, selectedDate: null, stats: [], cancelledStats: [] })
    }

    chooseMode = (mode) => {
        this.setState({ mode: mode })
        if (mode === "lecture") {
            API.getPastLectures(this.state.selectedCourse).then((lectures) => {
                console.log(lectures)
                this.setState({ lectures: lectures, stats: [], cancelledStats: [] })
            })
        } else if (mode === "month" || mode === "week" || mode === "total") {
            API.getStatistics(null, mode, this.state.selectedCourse).then((stats) => {
                this.setState({ stats: stats, selectedDate: null, lectureTime: null, cancelledStats: [] })
            })
        } else if (mode === "cancelled") {
            API.getCancelledBookingsStats(this.state.selectedCourse).then((stats) => {
                this.setState({ stats: [], selectedDate: null, lectureTime: null, cancelledStats: stats })
            })
        }
    }

    onSelectLecture = (lecture) => {
        let lectureTime = lecture.startingTime + "-" + lecture.endingTime;
        API.getStatistics(lecture.date, this.state.mode, this.state.selectedCourse).then((stats) => {
            this.setState({ stats: stats, selectedDate: lecture.date, lectureTime: lectureTime })
        })
    }



    /*
      TODO: - custom tooltip per i grafici?
      PROGRESS: - modificato salvataggio bookings per inserire data e mese di prenotazione
                - API per ottenimento statistiche funziona per settimana, mese e singola lezione
                - interazione tra diverse modalità funzionante
                - aggiunto grafico con totale prenotazioni per tutte le lezioni
                - aggiunta ora alla singola lezione 
                - calcolo date di inizio e fine settimana
     */

    render() {
        return (
            <>
                <Jumbotron>
                    <Row className="vheight-100">
                        <Col sm={4}></Col>
                        <Col sm={4} className="below-nav">
                            {(this.state.courses.length > 0) && <Dropdown>
                                <Dropdown.Toggle variant="outline-success" id="dropdown-basic" title={this.state.selectedCourse}>
                                    Choose the Course you want to view statistics of
                    </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {this.state.courses.map((course) => (<Dropdown.Item onClick={() => this.onSelectCourse(course.name)} key={course.name}>{course.name}</Dropdown.Item>))}
                                </Dropdown.Menu>
                            </Dropdown>}

                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        {
                            (this.state.courses.length > 0 && this.state.selectedCourse !== null) && <h4> Statistics for the course {this.state.selectedCourse}</h4>
                        }
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            {this.state.selectedCourse != null && <Button variant="outline-info" onClick={() => this.chooseMode("lecture")}> View Bookings of Single Lecture </Button>}
                        </Col>
                        <Col md="auto">
                            {this.state.selectedCourse != null && <Button variant="outline-info" onClick={() => this.chooseMode("week")}> View Bookings by Week </Button>}
                        </Col>
                        <Col md="auto">
                            {this.state.selectedCourse != null && <Button variant="outline-info" onClick={() => this.chooseMode("month")}> View Bookings by Month </Button>}
                        </Col>
                        <Col md="auto">
                            {this.state.selectedCourse != null && <Button variant="outline-info" onClick={() => this.chooseMode("total")}> View Total Bookings </Button>}
                        </Col>
                        <Col md="auto">
                            {this.state.selectedCourse != null && <Button variant="outline-info" onClick={() => this.chooseMode("cancelled")}> View Cancelled Bookings </Button>}
                        </Col>
                    </Row>
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
                    <Row className="justify-content-md-center">

                        {(this.state.stats.length > 0 && this.state.mode === "lecture") && <BarChart
                            width={500}
                            height={300}
                            data={this.state.stats}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="date">
                                <Label value={`Bookings for the lesson ${this.state.selectedDate} ${this.state.lectureTime}`} offset={0} position="insideBottom" />
                            </XAxis>
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="bookings" fill="#0000FF" />
                        </BarChart>}
                        {(this.state.stats.length === 0 && this.state.selectedDate != null) && <h4> There are no bookings for the lecture {this.state.selectedDate} {this.state.lectureTime}, so no statistics are available.</h4>}
                        {(this.state.mode === "month" && this.state.stats.length > 0) && <BarChart
                            width={500}
                            height={300}
                            data={this.state.stats}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="month">
                                <Label value={`Bookings divided by month`} offset={0} position="insideBottom" />
                            </XAxis>
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="bookings" fill="#0000FF" />
                        </BarChart>}
                        {(this.state.mode === "week" && this.state.stats.length > 0) && <BarChart
                            width={500}
                            height={300}
                            data={this.state.stats}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="week">
                                <Label value={`Bookings divided by week`} offset={0} position="insideBottom" />
                            </XAxis>
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="bookings" fill="#0000FF" />
                        </BarChart>}
                        {(this.state.mode === "total" && this.state.stats.length > 0) && <BarChart
                            width={500}
                            height={300}
                            data={this.state.stats}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="date">
                                <Label value={`Bookings divided by single lecture`} offset={0} position="insideBottom" />
                            </XAxis>
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="bookings" fill="#0000FF" />
                        </BarChart>}
                        {(this.state.mode === "cancelled" && this.state.cancelledStats.length > 0) && <BarChart
                            width={500}
                            height={300}
                            data={this.state.cancelledStats}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="date">
                                <Label value={`Cancelled bookings divided by single lecture`} offset={0} position="insideBottom" />
                            </XAxis>
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="cancellations" fill="#0000FF" />
                        </BarChart>}
                        {((this.state.mode === "week" || this.state.mode === "month" || this.state.mode === "total") && this.state.stats.length == 0) && <h4> There are no statistics available for the course {this.state.selectedCourse}</h4>}
                        {(this.state.mode === "lecture" && this.state.lectures.length == 0) && <h4> There are no in-presence lectures registered for the course {this.state.selectedCourse}</h4>}
                        {(this.state.mode === "cancelled" && this.state.cancelledStats == 0) && <h4> There are no cancelled bookings registered. </h4>}

                    </Row>

                </Jumbotron>
            </>)
    }
}

export default TeacherStatsViewer;