import React from 'react';
import { AuthContext } from '../auth/AuthContext'
import { ListGroup, Col, Row, Jumbotron } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faParagraph, faBirthdayCake } from '@fortawesome/free-solid-svg-icons'
import { Redirect } from 'react-router-dom';
import API from '../api/API';
const moment = require("moment");


class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            surname: '',
            id: '',
            lectures: [],
            lecture: '',
            student: '',
            b: '',
            role: ''
        };
    }

    /**
     * Retrieves, using the email used to access the system, a Person object containing name and surname of the logged in user
     */
    componentDidMount() {
        API.getPersonName(this.props.email).then((person) => {
            this.setState({ name: person.name, surname: person.surname, b: person.birthday, role: person.role });
        });
        API.getPersonName(this.props.email).then((person) => {
            if (person.role == 'Student') {
                API.getWeekLecturesList(this.props.id)
                    .then((lectures) => this.setState({ lectures: lectures }));
                this.setState({ id: this.props.id });
            }
            else {
                if (person.role == 'Teacher') {
                    API.getWeekTeacherLectureList(this.props.id)
                        .then((lectures) => this.setState({ lectures: lectures }));
                    this.setState({ id: this.props.id });
                }
            }
        }
        );
    }

    /**
     * Returns the name of one of the saved courses of the student
     * @param courseId a string containing the identifier of the course whose name is to be retrieved
     */
    findCourseName = (courseId) => {
        let course = this.props.courses.find((c) => c.courseId == courseId);
        return course.name;
    }

    /**
     * Returns, from the list of all teacher received as a prop by the parent component, information about the teacher associated with the id
     * @param teacherId a string containing the identifier of the teacher that is being researched
     */
    findTeacherName = (teacherId) => {
        let teacher = this.props.teachers.find((t) => t.id == teacherId);
        return teacher;
    }

    /**
     * Renders a welcome message, showing name and surname of the logged in user with some generic icons on the sides of the page. Very stilish,
     */
    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {(context.authErr || !context.authUser) && <Redirect to="/login"></Redirect>}
                        <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                            {
                                !((this.state.name && this.state.surname && (this.state.role == 'Student')) && (moment(this.state.b, "DD/MM/YYYY").format('DD/MM') == moment().format('DD/MM'))) &&

                                <FontAwesomeIcon icon={faParagraph} color="blue" flip="horizontal" size="7x"></FontAwesomeIcon>
                            }
                            {
                                (this.state.name && this.state.surname && (this.state.role == 'Student')) && (moment(this.state.b, "DD/MM/YYYY").format('DD/MM') == moment().format('DD/MM')) &&
                                <FontAwesomeIcon icon={faBirthdayCake} color="blue" flip="horizontal" size="7x"></FontAwesomeIcon>
                            }
                            {(this.state.name && this.state.surname) && (moment(this.state.b, "DD/MM/YYYY").format('DD/MM') != moment().format('DD/MM')) && <h1> Welcome {this.state.name}{" "}{this.state.surname}</h1>}
                            {!(this.state.name && this.state.surname) && <h1> Loading... </h1>}
                            {(this.state.name && this.state.surname && (this.state.role == 'Student')) && (moment(this.state.b, "DD/MM/YYYY").format('DD/MM') == moment().format('DD/MM')) &&
                                <h1> <strong>Happy birthday {this.state.name}{" "}{this.state.surname}!</strong></h1>}
                            {!(this.state.name && this.state.surname) && <h1> Loading... </h1>}
                            <Row>
                                <Col>
                                    {
                                        !((this.state.name && this.state.surname && (this.state.role == 'Student')) && (moment(this.state.b, "DD/MM/YYYY").format('DD/MM') == moment().format('DD/MM'))) &&

                                        <FontAwesomeIcon icon={faParagraph} color="blue" flip="horizontal" size="7x"></FontAwesomeIcon>
                                    }
                                    {
                                        (this.state.name && this.state.surname && (this.state.role == 'Student')) && (moment(this.state.b, "DD/MM/YYYY").format('DD/MM') == moment().format('DD/MM')) &&
                                        <FontAwesomeIcon icon={faBirthdayCake} color="blue" flip="horizontal" size="7x"></FontAwesomeIcon>
                                    }
                                </Col>
                            </Row>
                        </Jumbotron>
                        <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                            <Row className='col-12 m-0 p-0'>
                                <Col>
                                    {
                                        <LectureList id={this.state.id} lecture={this.state.lectures} role={this.state.role} findCourseName={this.findCourseName} findTeacherName={this.findTeacherName} />
                                    }
                                </Col>
                            </Row>
                        </Jumbotron>
                    </>
                )}
            </AuthContext.Consumer>
        );
    }

    /** 
     * When we decide to implement particular features in different homepages we can pass a string containing the role of the person when calling this component from App.js
     * (<HomePage email={email} role="Teacher" />), with possible roles being Student or Teacher
     * No use for passing the role of Manager since there's a Component for that already
     */
}


function LectureList(props) {

    return (
        ((props.role == 'Student') &&
            <ListGroup>
                <Row>
                    <Col>
                        {
                            <h3>Agenda</h3>
                        }
                    </Col>
                </Row>
                <ListGroup.Item className='border'>
                    <Row className='justify-content-around'>
                        <Col xs={1} className='text-center'>
                            <strong>Day</strong>
                        </Col>
                        <Col xs={1} className='text-center'>
                            <strong>Course Name</strong>
                        </Col>
                        <Col xs={1} className='text-center'>
                            <strong>Teacher Name</strong>
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
                    </Row>
                </ListGroup.Item>
                {
                    props.lecture.map((l) => (
                        <LectureItemStudent id={props.id} key={l.lectureId} lecture={l} findCourseName={props.findCourseName} findTeacherName={props.findTeacherName} />
                    ))
                }
            </ListGroup>)
        ||
        (
            (props.role == 'Teacher') &&
            <ListGroup>
                <Row>
                    <Col>
                        {
                            <h3>Agenda</h3>
                        }
                    </Col>
                </Row>
                <ListGroup.Item className='border'>
                    <Row className='justify-content-around'>
                        <Col xs={1} className='text-center'>
                            <strong>Day</strong>
                        </Col>
                        <Col xs={1} className='text-center'>
                            <strong>Course Name</strong>
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
                    </Row>
                </ListGroup.Item>
                {
                    props.lecture.map((l) => (
                        <LectureItemTeacher id={props.id} key={l.lectureId} lecture={l} findCourseName={props.findCourseName} findTeacherName={props.findTeacherName} />
                    ))
                }
            </ListGroup>

        ));

}

/**
 * Renders a single row of the list of lectures, containing one lecture.
 * Other than lecture information (course name, teacher name and surname, date, starting and ending time, classroom) it also shows the amount of already booked seats in relation to the total amount.
 * A button is also present, with different behaviors:
 *  - if the student isn't already booked for the lesson and there are still seats available the Book button is unlocked and the Deletebutton isn't available
 *  - if the student isn't already booked for the lesson and there are no more seats available the Book button is locked and the Delete button isn't available
 *  - if the student is already booked for the lesson the Delete button is unlocked and the Book button isn't available
 * @param props functions to handle closing of modals, functions to find course name, teacher name, maximum number of seats, booking, identifier of a student, a single Lecture object with its identifier
 */
function LectureItemStudent(props) {
    let courseName = props.findCourseName(props.lecture.courseId);
    let teacher = props.findTeacherName(props.lecture.teacherId);
    let today = moment();
    console.log(props.lecture)
    return (
        (
            (
                (moment(today, 'DD/MM/YYYY').format('DD/MM/YYYY') != moment(props.lecture.date, 'DD/MM/YYYY').format('DD/MM/YYYY'))
                &&
                <ListGroup.Item className='border mt-1'>
                    <Row className='justify-content-around'>
                        <Col xs={1} className='text-center'>
                            <strong>{moment(props.lecture.date, 'DD/MM/YYYY').format('dddd')}</strong>
                        </Col>
                        <Col xs={1} className='text-center'>
                            {courseName}
                        </Col>
                        <Col xs={1} className='text-center'>
                            {teacher.surname} {teacher.name}
                        </Col>
                        <Col xs={1} className='text-center'>
                            {props.lecture.startingTime}
                        </Col>
                        <Col xs={1} className='text-center'>
                            {props.lecture.endingTime}
                        </Col>
                        <Col xs={1} className='text-center'>
                            {props.lecture.classroomId}
                        </Col>
                    </Row>
                </ListGroup.Item>)
            ||
            (
                (moment(today, 'DD/MM/YYYY').format('DD/MM/YYYY') == moment(props.lecture.date, 'DD/MM/YYYY').format('DD/MM/YYYY'))
                &&
                <ListGroup.Item className='border mt-1' variant="primary">
                    <Row className='justify-content-around'>
                        <Col xs={1} className='text-center'>
                            <strong>{moment(props.lecture.date, 'DD/MM/YYYY').format('dddd')}</strong>
                        </Col>
                        <Col xs={1} className='text-center'>
                            {courseName}
                        </Col>
                        <Col xs={1} className='text-center'>
                            {teacher.surname} {teacher.name}
                        </Col>
                        <Col xs={1} className='text-center'>
                            {props.lecture.startingTime}
                        </Col>
                        <Col xs={1} className='text-center'>
                            {props.lecture.endingTime}
                        </Col>
                        <Col xs={1} className='text-center'>
                            {props.lecture.classroomId}
                        </Col>
                    </Row>
                </ListGroup.Item>)
        )
    );

}

function LectureItemTeacher(props) {
    let courseName = props.findCourseName(props.lecture.courseId);
    let today = moment();
    console.log(props.lecture)
    return (
        (
            (
                (moment(today, 'DD/MM/YYYY').format('DD/MM/YYYY') != moment(props.lecture.date, 'DD/MM/YYYY').format('DD/MM/YYYY'))
                &&
                <ListGroup.Item className='border mt-1'>
                    <Row className='justify-content-around'>
                        <Col xs={1} className='text-center'>
                            <strong>{moment(props.lecture.date, 'DD/MM/YYYY').format('dddd')}</strong>
                        </Col>
                        <Col xs={1} className='text-center'>
                            {courseName}
                        </Col>
                        <Col xs={1} className='text-center'>
                            {props.lecture.startingTime}
                        </Col>
                        <Col xs={1} className='text-center'>
                            {props.lecture.endingTime}
                        </Col>
                        <Col xs={1} className='text-center'>
                            {props.lecture.classroomId}
                        </Col>
                    </Row>
                </ListGroup.Item>)
            ||
            (
                (moment(today, 'DD/MM/YYYY').format('DD/MM/YYYY') == moment(props.lecture.date, 'DD/MM/YYYY').format('DD/MM/YYYY'))
                &&
                <ListGroup.Item className='border mt-1' variant="primary">
                    <Row className='justify-content-around'>
                        <Col xs={1} className='text-center'>
                            <strong>{moment(props.lecture.date, 'DD/MM/YYYY').format('dddd')}</strong>
                        </Col>
                        <Col xs={1} className='text-center'>
                            {courseName}
                        </Col>
                        <Col xs={1} className='text-center'>
                            {props.lecture.startingTime}
                        </Col>
                        <Col xs={1} className='text-center'>
                            {props.lecture.endingTime}
                        </Col>
                        <Col xs={1} className='text-center'>
                            {props.lecture.classroomId}
                        </Col>
                    </Row>
                </ListGroup.Item>)
        )
    );

}
export default HomePage;


