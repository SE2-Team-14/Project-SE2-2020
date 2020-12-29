import React from 'react';
import API from '../api/API';
import { AuthContext } from '../auth/AuthContext';
import { Redirect } from 'react-router-dom';
import { Jumbotron, Modal, Col, Row, Button, Form, Container } from 'react-bootstrap';

class UpdateBookableLecture extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedYears: [], selectedYear: '', selectedSemester: '', showYear: false, showSemester: false
        };
    }

    componentDidMount() {
    }

    modeYear = () => {
        this.setState({ showYear: true, showSemester: false });
    }

    modeSemester = () => {
        this.setState({ showYear: false, showSemester: true });
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
                                <Col xs={1}> <Button class="btn btn-secondary btn-sm" onClick={() => this.modeYear()}> Year </Button> </Col>
                                <Col xs={1}> <Button class="btn btn-secondary btn-sm" onClick={() => this.modeSemester()}> Semester </Button> </Col>
                            </Row>                
                            <Modal>
                                <Modal.Header>
                                    <Modal.Title></Modal.Title>
                                </Modal.Header>
                                <Modal.Body></Modal.Body>
                                <Modal.Footer>
                                    <Button variant='primary'>Yes</Button>
                                    <Button variant='secondary'>No</Button>
                                </Modal.Footer>
                            </Modal>
                        </Jumbotron>
                        {this.state.showYear &&
                        <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                                 <YearList></YearList>
                         </Jumbotron>
                        }
                        {this.state.showSemester &&
                        <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                            <SemesterList></SemesterList>
                        </Jumbotron>
                }
                        
                    </>
                )}
            </AuthContext.Consumer>
        );
    }

}
function YearList() {
    const years = [1, 2, 3, 4, 5];
    return (
        <Container>
            <Row><h4>Select in the following list, the year or the year that you want to update!</h4></Row>
            <Row className = 'text-center'>
                <Col xs={0.1} className='text-center'>
                    <Form.Check type={"checkbox"} id={years[0]} />
                </Col>
                <Col xs={1.5} className='text-center'>
                    Year 1
                </Col>
            </Row>
            <Row>
                <Col xs={0.1} className='text-center'>
                    <Form.Check type={"checkbox"} id={years[1]} />
                </Col>
                <Col xs={1.5} className='text-center'>
                    Year 2
                </Col>
            </Row>
            <Row>
                <Col xs={0.1} className='text-center'>
                    <Form.Check type={"checkbox"} id={years[2]} />
                </Col>
                <Col xs={1.5} className='text-center'>
                    Year 3
                </Col>
            </Row>
            <Row >
                <Col xs={0.1} className='text-center'>
                    <Form.Check type={"checkbox"} id={years[3]} />
                </Col>
                <Col xs={1.5} className='text-center'>
                    Year 4
                </Col>
            </Row>
            <Row >
                <Col xs={0.1} className='text-center'>
                    <Form.Check type={"checkbox"} id={years[4]} />
                </Col>
                <Col xs={1.5} className='text-center'>
                    Year 5
                </Col>
            </Row>
            <Row>
                <h4>     </h4>
            <Button> Confirm selection </Button>
            </Row>
            
        </Container>
    );
}

function SemesterList() {

    const semesters = [1, 2];
    return (
        <Container>
            <Row><h4>Select first the year and after the semester/semesters that you want to update</h4></Row>
            <Row>
                <Button class="btn btn-secondary btn-sm"> Year 1 </Button>
                <Button class="btn btn-secondary btn-sm"> Year 2 </Button>
                <Button class="btn btn-secondary btn-sm"> Year 3 </Button>
                <Button class="btn btn-secondary btn-sm"> Year 4 </Button>
                <Button class="btn btn-secondary btn-sm"> Year 5 </Button>
            </Row>
            <Row>
                <Col xs={0.1} className='text-center'>
                    <Form.Check type={"checkbox"} id={semesters[0]} />
                </Col>
                <Col xs={1.5} className='text-center'>
                    Semester 1
                </Col>
            </Row>
            <Row>
                <Col xs={0.1} className='text-center'>
                    <Form.Check type={"checkbox"} id={semesters[1]} />
                </Col>
                <Col xs={1.5} className='text-center'>
                    Semester 2
                </Col>
            </Row>
            <Row>
                <Button>Confirm selection</Button>
            </Row>
        </Container>
    );
}

export default UpdateBookableLecture;
