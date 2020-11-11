import React from 'react';
import { ListGroup, Col, Row, Jumbotron, Button, Modal} from 'react-bootstrap';
import API from '../api/API';


class LectureListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {lectures: [], showBookSuccess: false};
    }
    componentDidMount(){
        API.getLecturesList(this.props.studentId)
        .then((lectures) => this.setState({lectures : lectures}));
    }

    handleBookClick = (lecture, lectureId) => {
        this.setState({showBookSuccess: true, booklecture: lecture, booklectureId: lectureId});
    }

   // handleBook = (event, lecture, lectureId) => {
   //     event.preventDefault();
        
   // }

    //Book = (lectureId) =>{
    //    API.bookLecture
    //}
    handleClose = () => {
        this.setState({ showBookSuccess: false });
    }

    render() {
        return (
            <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                <Row className='col-12 m-0 p-0'>
                    <Col>
                        <LectureList lecture={this.state.lectures}/>
                    </Col>
                </Row>
                <Modal controlid='BookSuccess' show={this.state.showBookSuccess} onHide={this.handleClose} animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Your book is saved! Good Lesson!</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant='primary' onClick={this.handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Jumbotron>

        );
    }
}

function LectureList(props) {

    return (
        <ListGroup>
            <Row className='justify-content-around'>
                <h1>Bookable lectures</h1>
            </Row>
            <ListGroup.Item className='border'>
                <Row className='justify-content-around'>
                    <Col xs={1} className='text-center'>
                        <strong>Course Name</strong>
                    </Col>
                    <Col xs={1} className='text-center'>
                        <strong>Teacher Name</strong>
                    </Col>
                    <Col xs={1} className='text-center'>
                        <strong>Data</strong>
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
                    <Col xs={1} className='text-center'>
                        <strong>Seats</strong>
                    </Col>
                    <Col xs={1}></Col>
                    <Col xs={1}></Col>
                </Row>

            </ListGroup.Item>
            {
               props.lecture.map((l) => <LectureItem key={l.lectureId} lecture = {l} />)

            }
        </ListGroup>

    );

}

function LectureItem(props) {

    return (
        <ListGroup.Item className='border mt-1'>
            <Row className='justify-content-around'>
                <Col xs={1} className='text-center'>
                    {}
                </Col>
                <Col xs={1} className='text-center'>
                    {}
                </Col>
                <Col xs={1} className='text-center'>
                    {props.lecture.data}
                </Col>
                <Col xs={1} className='text-center'>
                    {props.lecture.startingTime}
                </Col>
                <Col xs={1} className='text-center'>
                    {props.lecture.endingTime}
                </Col>
                <Col xs={1} className='text-center'>
                    {props.lecture.classroom}
                </Col>
                <Col xs={1} className='text-center'>
                    {props.lecture.numberOfSeats}
                </Col>
                <Col xs={1} className='text-center'>
                    <Button>Book</Button>
                </Col>
                <Col xs={1} className='text-center'>
                    
                </Col>
            </Row>
        </ListGroup.Item>
    );
}



export default LectureListView;
