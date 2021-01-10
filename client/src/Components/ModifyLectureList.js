import React from 'react';
import API from '../api/API';

import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert"

import { AuthContext } from '../auth/AuthContext';
import { Redirect } from 'react-router-dom';

const moment = require('moment');

class ModifyLectureList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courses: [],
            coursesNames: [],
            schedules: [],
            tempSchedules: [],
            selectedCourse: null,
            courseId: null,
            showModal: false,
            daysHours: [],
            newDay: null,
            newStart: null,
            newLength: "1.5 hours",
            newClass: null,
            oldSchedule: null,
            showError: false,
            classrooms: [],
            wrongClass: false,
        }
    }

    componentDidMount() {
        API.getCoursesAndTeachers().then((courses) => {
            let newCourses = [];
            courses.map((course) => newCourses.push({ courseName: course.courseName + " - " + course.name + " " + course.surname, courseId: course.courseId }))
            API.getClassrooms().then((classes) => {
                this.setState({ courses: courses, coursesNames: newCourses, classrooms: classes })
            })

        })
    }

    onSelectCourse = (courseId, courseName) => {

        API.getScheduleByCourseId(courseId).then((schedules) => {
            this.setState({ schedules: schedules, selectedCourse: courseName, courseId: courseId })
        })



    }

    createItem = (schedule) => {
        return (
            <ListGroup.Item className="border mt-1">
                <Row className="justify-content-around">
                    <Col className="text-center">
                        {schedule.dayOfWeek}
                    </Col>
                    <Col className="text-center">
                        {schedule.startingTime}
                    </Col>
                    <Col className="text-center">
                        {schedule.endingTime}
                    </Col>
                    <Col className="text-center">
                        {schedule.classroom}
                    </Col>
                    <Col className="text-center">
                        <Button variant="success" onClick={() => this.onClickModify(schedule)}> Modify Schedule </Button>
                    </Col>
                </Row>
            </ListGroup.Item>
        )
    }

    onClickModify = (schedule) => {
        let schedules = this.state.schedules;
        let sch = [];
        for (let i = 0; i < schedules.length; i++) {
            if (schedules[i] !== schedule) {
                sch.push(schedules[i]);
            }
        }
        this.setState({ showModal: true, newDay: schedule.dayOfWeek, newClass: schedule.classroom, oldSchedule: schedule, tempSchedules: sch })
    }

    onClickClose = () => {
        this.setState({ showModal: false })
    }

    onClickSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity()) {
            let newDay = this.state.newDay;
            let newStart = this.state.newStart;
            let newLength = this.state.newLength === "1.5 hours" ? 90 : 180;
            let newClass = this.state.newClass;

            let error = false;
            let newSeats = 0;
            for (let s of this.state.tempSchedules) {

                if (s.dayOfWeek === newDay) {
                    if ((s.startingTime === newStart) || (moment(newStart, "HH:mm").add(newLength, "minutes").format("HH:mm") > s.startingTime)) {
                        error = true;
                    }
                }
            }
            if (error) {
                this.setState({ showError: true })
            } else {
                API.getFullClassrooms(newDay, newStart, moment(newStart, "HH:mm").add(newLength, "minutes").format("HH:mm")).then((classrooms) => {
                    if (classrooms.indexOf(newClass) === -1) {
                        for (let i = 0; i < this.state.classrooms.length; i++) {
                            if (this.state.classrooms[i].classroom === newClass) {
                                newSeats = this.state.classrooms[i].maxNumberOfSeats;
                            }
                        }
                        let newSchedule = {
                            courseId: this.state.courseId,
                            dayOfWeek: newDay,
                            startingTime: newStart,
                            endingTime: moment(newStart, "HH:mm").add(newLength, "minutes").format("HH:mm"),
                            classroom: newClass,
                            numberOfSeats: newSeats,
                        };
                        let schedules = this.state.tempSchedules;
                        schedules.push(newSchedule);
                        // API.modifySchedule(newSchedule.courseId, this.state.oldSchedule.dayOfWeek, newSchedule, this.state.oldSchedule.startingTime).then(() => {
                        //   this.setState({ schedules: schedules, showModal: false })
                        //})
                    } else {
                        this.setState({ wrongClass: true })
                    }
                })
            }
        } else {
            form.reportValidity();
        }
    }

    onChangeDay = (event) => {
        this.setState({ newDay: event.target.value })
    }

    onChangeStart = (event) => {
        this.setState({ newStart: event.target.value })
    }

    onChangeLength = (event) => {
        this.setState({ newLength: event.target.value })
    }

    onChangeClass = (event) => {
        this.setState({ newClass: event.target.value })
    }

    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {(context.authErr || !context.authUser) && <Redirect to="/login"></Redirect>}
                        <Jumbotron style={{ background: "none" }}>
                            <Row className="justify-content-md-center">
                                <Col md="auto">
                                    <h4> Modify Schedule of Courses</h4>
                                </Col>
                            </Row>
                            <Row className="h-75 d-inline-block">{""}</Row>
                            {(this.state.courses.length === 0) && <Row className="justify-content-md-center">
                                <Col md="auto">
                                    <h4> There are no courses you can modify schedule of.</h4>
                                </Col>
                            </Row>}
                            <Row className="h-75 d-inline-block">{""}</Row>
                            <Row className="justify-content-md-center">
                                <Col md="auto">
                                    {(this.state.courses.length > 0) && <Dropdown>
                                        <Dropdown.Toggle variant="outline-success" id="dropdown-basic">
                                            Choose the course you want to modify the schedule of
                                </Dropdown.Toggle>
                                        <Dropdown.Menu className="dropdown-menu pre-scrollable" style={{ overflowY: 'scroll', maxHeight: "200px" }}>
                                            {this.state.coursesNames.map((course) => (<Dropdown.Item onClick={() => this.onSelectCourse(course.courseId, course.courseName)} key={course.courseId}>{course.courseName}</Dropdown.Item>))}
                                        </Dropdown.Menu>
                                    </Dropdown>}
                                </Col>
                            </Row>
                            <Row className="h-75 d-inline-block">{""}</Row>
                            <Row className="justify-content-md-center">
                                <Col md="auto">
                                    {(this.state.selectedCourse !== null && this.state.schedules.length === 0) && <h4> There isn't a schedule available for the course {this.state.selectedCourse}</h4>}
                                    {(this.state.selectedCourse !== null && this.state.schedules.length > 0) && <ListGroup>
                                        <Row className="justify-content-around">
                                            <h4> Schedule defined for the course {this.state.selectedCourse}</h4>
                                        </Row>
                                        <ListGroup.Item className="border">
                                            <Row className="justify-content-around">
                                                <Col className="text-center">
                                                    Day
                                                </Col>
                                                <Col className="text-center">
                                                    Starting Time
                                                </Col>
                                                <Col className="text-center">
                                                    Ending Time
                                                </Col>
                                                <Col className="text-center">
                                                    Classroom
                                                </Col>
                                                <Col className="text-center"></Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {this.state.schedules.map((sch) => this.createItem(sch))}
                                    </ListGroup>}
                                </Col>
                            </Row>
                            <Modal show={this.state.showModal} animation={false}>
                                <Modal.Header closeButton={true} onClick={() => this.onClickClose()}>
                                    <Modal.Title> Modify Schedule</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form method="PUT" onSubmit={(event) => this.onClickSubmit(event)}>
                                        <Form.Group controlId="formNewDate">
                                            <Form.Label> Choose New Day of Lecture</Form.Label>
                                            <Form.Control as="select" required onChange={(event) => this.onChangeDay(event)} defaultValue={this.state.newDay}>
                                                <option>mon</option>
                                                <option>tue</option>
                                                <option>wed</option>
                                                <option>thu</option>
                                                <option>fri</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId="formNewStart">
                                            <Form.Label> Choose New Starting Time of Lecture</Form.Label>
                                            <Form.Control type="time" min={"08:00"} max={"17:30"} required onChange={(event) => this.onChangeStart(event)}></Form.Control>
                                        </Form.Group>
                                        {(this.state.newStart !== null) && <Form.Group controlId="formNewEnd">
                                            <Form.Label> Choose New Length of Lecture</Form.Label>
                                            <Form.Control as="select" required onChange={(event) => this.onChangeLength(event)} defaultValue={this.state.newLength}>
                                                <option> 1.5 hours</option>
                                                {(this.state.newStart <= "16") && <option>3 hours</option>}
                                            </Form.Control>
                                        </Form.Group>}
                                        <Form.Group controlId="formNewClassroom">
                                            <Form.Label> Choose New Classroom of Lecture</Form.Label>
                                            <Form.Control as="select" required defaultValue={this.state.newClass} onChange={(event) => this.onChangeClass(event)}>
                                                {this.state.classrooms.map((i) => <option>{i.classroom}</option>)}
                                            </Form.Control>
                                        </Form.Group>
                                        <Button variant="success" type="submit"> Submit Modifications</Button>
                                    </Form>
                                    {this.state.showError && <Alert variant="danger"> Error! Schedule invalid!</Alert>}
                                    {this.state.wrongClass && <Alert variant="danger"> Error! You selected a classroom that already has a lecture for the specified date and time!</Alert>}
                                </Modal.Body>
                            </Modal>

                        </Jumbotron>
                    </>
                )
                }
            </AuthContext.Consumer>
        )
    }
}

export default ModifyLectureList