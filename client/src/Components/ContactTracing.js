import React from 'react';
import { AuthContext } from '../auth/AuthContext'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { Redirect } from 'react-router-dom';
import tracingImage from "./assets/tracingImage.png"
import moment from 'moment'
import P5 from 'p5';



import API from '../api/API';

const p5 = new P5(); // create a p5 instance 


class ContactTracing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    onChangeStudentId(event) {
        this.setState({ studentId: event.target.value });
        console.log(this.state);
    }


    handleSubmit(event) {
        this.generateReportFile();
    }

    generateReportFile() {
        let studentId = this.state.studentId;
        API.getContactTracingByStudent(studentId)
            .then((result) => {
                if (result.length > 0) {
                    let fileContent = ["ID, Name, Surname, Email"];
                    let fileName = "Contact_Tracing_Report_" + studentId + "_" + moment();
                    for (let line of result) {
                        fileContent.push(line);
                    }
                    p5.saveStrings(fileContent, fileName, "csv");
                } else {
                    alert("No such contact information for that student");
                }
            })
            .catch((err) => alert("Cannot generate report file for the selected student"));
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
                        <h1>Contact Tracing</h1>
                        <h6>Insert the id of the positive student</h6>
                        <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                            <img src={tracingImage} width={200} heght={200} />
                            <Row>
                                <Col>

                                    <Form.Group>
                                        <Form.Label>Student id</Form.Label>
                                        <Form.Control type="text" name="student-id" placeholder="Student ID" onChange={(ev) => this.onChangeStudentId(ev)} required />
                                    </Form.Group>

                                    <Form>

                                        <Form.Group>
                                            <Button variant="danger" onClick={(event) => this.handleSubmit(event)}>Download Report</Button>
                                        </Form.Group>

                                    </Form>
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

export default ContactTracing;
