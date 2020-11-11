import React from 'react';
import { ListGroup, Col, Row, Jumbotron, Button} from 'react-bootstrap';



class LectureListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }



    render() {
        return (
            <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                <Row className='col-12 m-0 p-0'>
                    <Col>
                        <LectureList />
                    </Col>
                </Row>
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
               <LectureItem />

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
                    {}
                </Col>
                <Col xs={1} className='text-center'>
                    {}
                </Col>
                <Col xs={1} className='text-center'>
                    {}
                </Col>
                <Col xs={1} className='text-center'>
                    {}
                </Col>
                <Col xs={1} className='text-center'>
                    {}
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
