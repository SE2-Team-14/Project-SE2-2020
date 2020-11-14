import React from 'react';
import { AuthContext } from '../auth/AuthContext'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from "react-bootstrap/Button";

import BookedStudentsList from "./BookedStudentsList.js";


class TeacherHomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.showBookings = false;
  }
  /* <h1> Teacher Home Page: (insert here Teacher id)</h1>
                <Row>
                  <Col>
                    {
                      <p>PUT HERE THE BODY OF THE PAGE</p>
                    }
                  </Col>
                </Row>
  */



  render() {
    return (
      <AuthContext.Consumer>
        {(context) => (
          <>
            {context.authUser &&/*(context.authErr || !context.authUser) && <Redirect to="/login"></Redirect>  TODO: quando funzionera il login*/
              <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                <h1> Teacher Home Page: (insert here Teacher id)</h1>
                <Row>
                  <Col>
                    {
                      <p>PUT HERE THE BODY OF THE PAGE</p>
                    }
                  </Col>
                </Row>
              </Jumbotron>
            }

          </>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default TeacherHomePage;