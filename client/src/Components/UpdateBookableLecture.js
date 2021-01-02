import React from 'react';
import API from '../api/API';
import { AuthContext } from '../auth/AuthContext';
import { Redirect } from 'react-router-dom';
import { Jumbotron, Modal, Col, Row, Button, Form, Container, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';


class UpdateBookableLecture extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedYears: [1], selectedSemester: 1, showYear: false, showSemester: false, showmodalConfirm: false, showModalSuccess: false, showModalError: false,
            courses: [],
        };
    }

    onChangeYear = (year) => {
        let check = this.state.selectedYears.find((y) => (y == year));
        if ((check)) {
            let arrayFiltrato = this.state.selectedYears.filter((y) => (y != year));
            this.setState({ selectedYears : arrayFiltrato });
        } else {
            let arrayFiltrato = [...this.state.selectedYears];
            arrayFiltrato.push(year);
            this.setState({ selectedYears : arrayFiltrato });
        }

    }

    selectYear = (year) => {
        this.setState({selectedYear: year});
    }

    selectSemester = (semester) => {
        this.setState({selectedSemester: semester});
    }
    
    modeYear = () => {
        this.setState({ showYear: true, showSemester: false, selectedYears: [1], selectedSemester: 1 });
    }
    modeSemester = () => {
        this.setState({ showYear: false, showSemester: true, selectedYears: [1], selectedSemester: 1 });
    }

    handleClose = () => {
        this.setState({showModalSuccess: false, showModalSemester: false, showmodalConfirm: false, showModalError: false});
    }

    handleClickYear = () => {
        if(this.state.selectedYears.length == 0)
            this.setState({showModalError : true});
        else
                API.getCoursesByYear(this.state.selectedYears).then((courses) => this.setState({courses: courses}, () => this.setState({showmodalConfirm: true})));

    }

    handleClickSemester = () => {
        if(this.state.selectedYears.length == 0)
            this.setState({showModalError : true});
        else
            API.getCoursesByYearAndSemester(this.state.selectedYears, this.state.selectedSemester).then((courses) => this.setState({courses: courses}, () => this.setState({showmodalConfirm: true})));
    }

    confirmSelection = () => {
        API.updateBookableLecture(this.state.courses).then(() => this.setState({showmodalConfirm: false, showModalSuccess: true}));
    }

    handleSuccess = () => {
        this.setState({showModalError: true});
    }


    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {(context.authErr || !context.authUser) && <Redirect to="/login"></Redirect>}
                        <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                            <Row className='col-12 m-0 p-0'>
                                <Col xs={5}> <h3>Do you want update for year or for semester?</h3> </Col>
                                <Col xs={1}> <Button variant = "secondary" onClick={() => this.modeYear()}> Year </Button> </Col>
                                <Col xs={1}> <Button variant = "secondary" onClick={() => this.modeSemester()}> Semester </Button> </Col>
                            </Row>
                            <Modal controlid='ConfirmYearSelection' show={this.state.showmodalConfirm} onHide={this.handleClose} animation={false} >
                                <Modal.Header>
                                    <Modal.Title></Modal.Title>
                                </Modal.Header>
                                <Modal.Body>{this.state.courses.length} courses gonna be changed to virtual! Do you want confirm your selection?</Modal.Body>
                                <Modal.Footer>
                                    <Button variant='primary' onClick = {() => this.confirmSelection()}>Yes</Button>
                                    <Button variant='secondary' onClick={() => this.handleClose()}>No</Button>
                                </Modal.Footer>
                            </Modal>
                            <Modal controlid='UpdateSuccess' show={this.state.showModalSuccess} onHide={this.handleClose} animation={false} >
                                <Modal.Header>
                                    <Modal.Title></Modal.Title>
                                </Modal.Header>
                                <Modal.Body> Your changes are saved!</Modal.Body>
                                <Modal.Footer>
                                    <Button variant='secondary' onClick = {() => this.handleClose()}>Ok</Button>
                                </Modal.Footer>
                            </Modal>
                            <Modal controlid='Error' show={this.state.showModalError} onHide={this.handleClose} animation={false} >
                                <Modal.Header>
                                    <Modal.Title> Cannot update courses if you don't select at least one year.</Modal.Title>
                                </Modal.Header>
                                <Modal.Footer>
                                    <Button variant='secondary' onClick={() => this.handleClose()}>Ok</Button>
                                </Modal.Footer>
                            </Modal>
                        </Jumbotron>
                        {this.state.showYear &&
                            <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                                <YearList onChangeYear = {this.onChangeYear} handleClickYear = {this.handleClickYear}></YearList>
                            </Jumbotron>
                        }
                        {this.state.showSemester &&
                            <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                                <SemesterList selectSemester={this.selectSemester} onChangeYear={this.onChangeYear} handleClickSemester = {this.handleClickSemester}></SemesterList>
                            </Jumbotron>
                        }

                    </>
                )}
            </AuthContext.Consumer>
        );
    }

}
function YearList(props) {
    const years = [1, 2, 3, 4, 5];
    return (
        <Container>
            <Row><h4>Select in the following list, the year or the years that you want to make virtual!</h4></Row>
            <p></p>
            <Row className='text-center'>
                <Col xs={0.1} className='text-center'>
                    <Form.Check defaultChecked type={"checkbox"} id={years[0]} label="Year 1" onChange={() => props.onChangeYear(years[0])} />
                </Col>
            </Row>
            <Row>
                <Col xs={0.1} className='text-center'>
                    <Form.Check type={"checkbox"} id={years[1]} label = "Year 2" onChange={() => props.onChangeYear(years[1])}/>
                </Col>
            </Row>
            <Row>
                <Col xs={0.1} className='text-center'>
                    <Form.Check type={"checkbox"} id={years[2]} label="Year 3" onChange={() => props.onChangeYear(years[2])}/>
                </Col>
            </Row>
            <Row >
                <Col xs={0.1} className='text-center'>
                    <Form.Check type={"checkbox"} id={years[3]} label = "Year 4" onChange={() => props.onChangeYear(years[3])}/>
                </Col>
            </Row>
            <Row >
                <Col xs={0.1} className='text-center'>
                    <Form.Check type={"checkbox"} id={years[4]} label="Year 5" onChange={() => props.onChangeYear(years[4])}/>
                </Col>
            </Row>
            <p></p>
            <Row>
                <Button onClick = {() => props.handleClickYear()}> Confirm selection </Button>
            </Row>

        </Container>
    );
}

function SemesterList(props) {

    const semesters = [1, 2];
    return (
        <Container>
            <Row><h4>Select first the year or the years and after the semester that you want to make virtual!</h4></Row>
            <p></p>
            <Row>
            <ToggleButtonGroup type="checkbox" name="options" defaultValue={1} >
                <ToggleButton variant="outline-primary" value={1} onChange={() => props.onChangeYear(1)}> Year 1</ToggleButton>
                <ToggleButton variant="outline-primary" value={2} onChange={() => props.onChangeYear(2)}> Year 2</ToggleButton>
                <ToggleButton variant="outline-primary" value={3} onChange={() => props.onChangeYear(3)}> Year 3</ToggleButton>
                <ToggleButton variant="outline-primary" value={4} onChange={() => props.onChangeYear(4)}> Year 4</ToggleButton>
                <ToggleButton variant="outline-primary" value={5} onChange={() => props.onChangeYear(5)}> Year 5</ToggleButton>
            </ToggleButtonGroup>
            </Row>
            <p></p>
            <Form.Group >
                <Col xs={2} className='text-center'>
                    <Form.Check defaultChecked type={"radio"} name="radio" id={semesters[0]} label = "Semester 1" onChange={() => props.selectSemester(semesters[0])} default/>
                </Col>
                
                <Col xs={2} className='text-center'>
                    <Form.Check type={"radio"} name="radio" id={semesters[1]} label ="Semester 2" onChange={() => props.selectSemester(semesters[1])}/>
                </Col>
            </Form.Group>
            <p></p>
            <Row>
                <Button onClick = {() => props.handleClickSemester()}>Confirm selection</Button>
            </Row>
        </Container>
    );
}

export default UpdateBookableLecture;
