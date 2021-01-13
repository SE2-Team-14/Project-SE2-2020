import React from 'react';
import YouTube from 'react-youtube';
import {Col, Row, Jumbotron, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
const pdf_s = '/tutorial/Students_tutorial.pdf'
const pdf_t = '/tutorial/Teachers_tutorial.pdf'
class Tutorial extends React.Component {
  constructor(props) {
    super(props);

}

  render() {
    const opts = {
      //854 x 480 
      height: '480',
      width: '854',
      playerVars: {
        autoplay: 0,
      },
    };

    return (
      <Jumbotron className='d-flex justify-content-center col-12 m-0 p-3' style={{background: "none"}}>
        <Col>
          {this.props.role === "Student" && <Row className='justify-content-end col-12 m-0 p-0'>  
            <Link to = {pdf_s} target = "_blank" download><Button variant = "outline-info"> Click to download the pdf documentation <span></span></Button></Link>
          </Row>}
          {this.props.role === "Teacher" && <Row className='justify-content-end col-12 m-0 p-0'>  
            <Link to = {pdf_t} target = "_blank" download><Button variant = "outline-info"> Click to download the pdf documentation <span></span></Button></Link>
          </Row>}
          <Row className='justify-content-center col-12 m-0 p-0'>
            <h3>{this.props.role}s Tutorial</h3>
          </Row>
          <br/>
          {this.props.role === "Student" && <Row className='justify-content-center col-12 m-0 p-0'>
            <YouTube videoId="o-3Ar8tl36Q" opts={opts} onReady={this._onReady} />
          </Row>}
          {this.props.role === "Teacher" && <Row className='justify-content-center col-12 m-0 p-0'>
            <YouTube videoId="FZHE-ppVp1M" opts={opts} onReady={this._onReady} />
          </Row>}
          <br/>
        </Col>
      </Jumbotron>      
  );
  }
 
  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
}
export default Tutorial;
