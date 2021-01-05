import React from 'react';
import API from '../api/API';

import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from "react-bootstrap/Jumbotron";
import ListGroup from "react-bootstrap/ListGroup";

import { AuthContext } from '../auth/AuthContext';
import { Redirect } from 'react-router-dom';

import LectureAttendance from "./LectureAttendance";

const moment = require('moment');

class RecordAttendance extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentLecture: [],
            lectureToday: false,
            today: null,
            lectureComps: [],
        }
    }

    componentDidMount() {
        API.getCurrentLecture(this.props.id).then((lecture) => {
            let lectureToday = true;
            let today = moment().format("DD/MM/YYYY");
            if (lecture.length === 0) {
                this.setState({ today: today })
            } else {
                let lectureComps = [];
                for (let l of lecture) {
                    lectureComps.push(<LectureAttendance lecture={l}></LectureAttendance>)
                }
                this.setState({
                    lectureComps: lectureComps, lectureToday: lectureToday,
                    today: today, currentLecture: lecture
                })
            }

        });
    }



    render() {
        return <AuthContext.Consumer>
            {(context) => (
                <>
                    {(context.authErr || !context.authUser) && <Redirect to="/login"></Redirect>}
                    <Jumbotron style={{ background: "none" }}>
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                                <h4> Record Attendance for the day {this.state.today}</h4>
                            </Col>
                        </Row>
                        <Row className="h-75 d-inline-block">{""}</Row>
                        <Row className="justify-content-md-center">
                            {(!this.state.lectureToday) && <Col md="auto">
                                <h4> There are no lecture in presence taking place today, so attendance can't be recorded.</h4>
                            </Col>}

                        </Row>
                        {(this.state.lectureToday) &&
                            <>
                                {this.state.lectureComps}
                            </>
                        }
                    </Jumbotron>
                </>
            )}
        </AuthContext.Consumer>
    }
}

export default RecordAttendance;