import React from 'react';
import { AuthContext } from '../auth/AuthContext'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faParagraph } from '@fortawesome/free-solid-svg-icons'

import API from '../api/API';


class TeacherHomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.showBookings = false;
    this.state.name = "";
    this.state.surname = "";
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

  componentDidMount() {
    API.getPersonName(this.props.email).then((person) => {
      this.setState({ name: person.name, surname: person.surname })
    })
  }


  render() {
    return (
      <AuthContext.Consumer>
        {(context) => (
          <>
            {context.authUser &&/*(context.authErr || !context.authUser) && <Redirect to="/login"></Redirect>  TODO: quando funzionera il login*/
              <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
                <FontAwesomeIcon icon={faParagraph} color="blue" flip="horizontal" size="7x"></FontAwesomeIcon>
                {(this.state.name && this.state.surname) && <h1> Welcome {this.state.name}{" "}{this.state.surname}</h1>}
                {!(this.state.name && this.state.surname) && <h1> Loading... </h1>}
                <Row>
                  <Col>
                    {
                      <FontAwesomeIcon icon={faParagraph} color="blue" flip="horizontal" size="7x"></FontAwesomeIcon>
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
