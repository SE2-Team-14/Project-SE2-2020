import React from 'react';
import { AuthContext } from '../auth/AuthContext'
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { Redirect } from 'react-router-dom';
import tracingImage from "./assets/tracingImage.png"
import moment from 'moment'
import P5 from 'p5';
import jsPDF from 'jspdf'


import API from '../api/API';

const p5 = new P5(); // create a p5 instance 


class ContactTracing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    onChangePersonId(event) {
        this.setState({ personId: event.target.value });
        console.log(this.state);
    }


    handleSubmit(event) {
        this.generateReportFile();
    }

    generateReportFile() {
        let personId = this.state.personId;
        API.getContactTracingByPerson(personId)
            .then((result) => {
                if (result.length > 0) {
                    let fileName = "Contact_Tracing_Report_" + personId + "_" + moment();
                    this.generateCSVReport(fileName, result);
                    this.generatePDFReport(fileName, result);
                } else {
                   this.setState({alertMessage : "No such contact information for that person"});
                }
            })
            .catch((err) => this.setState({alertMessage : "Cannot generate report file for the selected person"}));
    }


    generateCSVReport(fileName, result) {
        let fileContent = ["ID, Name, Surname, Email"];
        for (let line of result) {
            fileContent.push(line);
        }
        p5.saveStrings(fileContent, fileName, "csv");
    }

    generatePDFReport(fileName, result) {
        const LINE_GAP = 10;
        let y = 70;

        var doc = new jsPDF()

        doc.setFontSize(40);
        doc.text(30, 25, 'Contact Tracing Report: ');
        doc.setFontSize(20);
        doc.text(35, 50, 'List of possible contacts in the last 14 days');
        doc.setFontSize(12);
        for (let line of result) {
            doc.text(10, y, line)
            y += LINE_GAP;
        }
        doc.save(fileName)
    }

    /**
     * Closes the modal.
     */
    handleClose = () => {
        this.setState({alertMessage: null});
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
                        <h6>Insert the id of the positive person (Student or Teacher)</h6>
                        <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3' style={{background: "none"}}>
                            <img src={tracingImage} width={200} heght={200} />
                            <Row>
                                <Col>

                                    <Form.Group>
                                        <Form.Label>Person id</Form.Label>
                                        <Form.Control type="text" name="person-id" placeholder="Person ID" onChange={(ev) => this.onChangePersonId(ev)} required />
                                    </Form.Group>

                                    <Form>

                                        <Form.Group>
                                            <Button variant="danger" onClick={(event) => this.handleSubmit(event)}>Download Report</Button>
                                        </Form.Group>

                                    </Form>
                                </Col>
                            </Row>
                            <Modal controlid='Alert' show={this.state.alertMessage && true} onHide={this.handleClose} animation={false}>
                                <Modal.Header closeButton>
                                    <Modal.Title>{this.state.alertMessage}</Modal.Title>
                                </Modal.Header>
                            </Modal>
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
