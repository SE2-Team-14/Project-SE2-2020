import React from 'react';
import API from '../api/API';

import Dropdown from 'react-bootstrap/Dropdown';
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
        }
    }

    componentDidMount() {
        API.getCourses(this.props.email).then((courses) => {
            this.setState({ courses: courses })
        })
    }

    onSelectCourse = (course) => {
        this.setState({ selectedCourse: course })
    }

    chooseMode = (mode) => {
        this.setState({ mode: mode })
        if (mode === "lecture") {
            API.getPastLectures(this.state.selectedCourse).then((lectures) => {
                this.setState({ lectures: lectures })
            })
        } else if (mode === "month") {
            API.getStatistics(null, mode, this.state.selectedCourse).then((stats) => {
                this.setState({ stats: stats })
            })
        } else if (mode === "week") {
            API.getStatistics(null, mode, this.state.selectedCourse).then((stats) => {
                this.setState({ stats: stats })
            })
        }
    }

    onSelectLecture = (date) => {
        API.getStatistics(date, this.state.mode, this.state.selectedCourse).then((stats) => {
            this.setState({ stats: stats, selectedDate: date })
        })
    }

    onClickReset = () => {
        this.setState({ selectedCourse: null, mode: null, stats: [], selectedDate: null, })
    }



    /*
      TODO: - ponderare se tenere pulsante reset o permettere tutti i pulsanti con cambiamento della pagina di volta in volta
            - custom tooltip per i grafici
            - capire se vogliono le prenotazioni totali per settimana/mese o relative ad una singola lezione
            - fixare interazione tra diversi pulsanti: passare da modalità settimana a singola lezione ha problemi di rendering roba sbagliata
      PROGRESS: - modificato salvataggio bookings per inserire data e mese di prenotazione
                - API per ottenimento statistiche funziona per settimana, mese e singola lezione
     */

    render() {
        return (
            <>
                <Row className="vheight-100">
                    <Col sm={4}></Col>
                    <Col sm={4} className="below-nav">
                        {(this.state.courses.length > 0 && this.state.selectedCourse === null) && <Dropdown>
                            <Dropdown.Toggle variant="outline-success" id="dropdown-basic" title={this.state.selectedCourse}>
                                Choose the Course you want to view statistics of
                    </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {this.state.courses.map((course) => (<Dropdown.Item onClick={() => this.onSelectCourse(course.name)} key={course.name}>{course.name}</Dropdown.Item>))}
                            </Dropdown.Menu>
                        </Dropdown>}
                        {
                            (this.state.courses.length > 0 && this.state.selectedCourse !== null) && <h4> Statistics for the course {this.state.selectedCourse}</h4>
                        }
                    </Col>
                </Row>
                <Row className="vheight-100">
                    <Col sm={4}>
                        {this.state.selectedCourse != null && <Button variant="outline-info" onClick={() => this.chooseMode("lecture")}> View Bookings by Lecture </Button>}
                    </Col>
                    <Col sm={4}>
                        {this.state.selectedCourse != null && <Button variant="outline-info" onClick={() => this.chooseMode("week")}> View Bookings by Week </Button>}
                    </Col>
                    <Col sm={4}>
                        {this.state.selectedCourse != null && <Button variant="outline-info" onClick={() => this.chooseMode("month")}> View Bookings by Month </Button>}
                    </Col>
                </Row>
                <Row className="vheight-100">
                    <Col sm={4}>
                        {(this.state.mode === "lecture" && this.state.lectures.length > 0) && <Dropdown>
                            <Dropdown.Toggle variant="outline-info" id="dropdown-basic" title={this.state.selectedCourse}>
                                Choose the lecture you want to view statistics of
                    </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {this.state.lectures.map((lecture) => (<Dropdown.Item onClick={() => this.onSelectLecture(lecture.date)} key={lecture.date}>{lecture.date}</Dropdown.Item>))}
                            </Dropdown.Menu>
                        </Dropdown>}
                    </Col>
                    <Col sm={4}>
                        {this.state.mode === "week" && <h4> Graph </h4>}
                    </Col>
                    <Col sm={4}>

                    </Col>
                </Row>
                <Row className="vheight-100">
                    <Col sm={4}>
                    </Col>
                    <Col sm={4}>
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
                                <Label value={`Bookings for the lesson ${this.state.selectedDate}`} offset={0} position="insideBottom" />
                            </XAxis>
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="bookings" fill="#0000FF" />
                        </BarChart>}
                        {(this.state.stats.length === 0 && this.state.selectedDate) && <h4> There are no bookings for the lecture {this.state.selectedDate}, so no statistics are available.</h4>}
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
                                <Label value={`Bookings divided by week of year`} offset={0} position="insideBottom" />
                            </XAxis>
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="bookings" fill="#0000FF" />
                        </BarChart>}
                        {(this.state.mode !== null && this.state.stats.length === 0) && <h4> There are no in-presence lectures registered for the course {this.state.selectedCourse}</h4>}
                    </Col>
                    <Col sm={4}>
                    </Col>
                </Row>
                <Row className="vheight-100">
                    <Col sm={4}>
                    </Col>
                    <Col sm={4}>
                    </Col>
                    <Col sm={4}>
                        {this.state.mode != null && <Button variant="outline-danger" onClick={() => this.onClickReset()}> Reset Shown Statistics </Button>}
                    </Col>
                </Row>


            </>)
    }
}

export default TeacherStatsViewer;