import React from 'react';
import { AuthContext } from '../auth/AuthContext'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';




class TeacherHomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return (
      <AuthContext.Consumer>
        {(context) => (
          <>
            {/*(context.authErr || !context.authUser) && <Redirect to="/login"></Redirect>  TODO: quando funzionera il login*/}
            <Container fluid>
            <h1> Teacher Home Page: (insert here Teacher id)</h1>
            <Row>
                <Col>
                {
                    <p>PUT HERE THE BODY OF THE PAGE</p>
                }
                </Col>
            </Row>
            </Container>
          </>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default TeacherHomePage;