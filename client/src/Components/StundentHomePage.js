import React from 'react';

import { AuthContext } from '../auth/AuthContext'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Jumbotron from 'react-bootstrap/Jumbotron';
import API from '../api/API';



class StudentHomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  login = (user) => {
    API.login(user).then((res) => {
      if (res.error_no == 0) {
        this.props.loginCallback(res.user)
        this.setState({ submitted: true });
      } else {
        alert(res.error_info)
      }
      console.log(res)
    })
  }

  render() {
    return (
      <AuthContext.Consumer>
        {(context) => (
          <>
            {/*(context.authErr || !context.authUser) && <Redirect to="/login"></Redirect>  TODO: quando funzionera il login*/}
            <Jumbotron className='d-flex justify-content-around col-12 m-0 p-3'>
            <h1> Student Home Page: (insert here Student id)</h1>
            <Row>
                <Col>
                {
                    <p>PUT HERE THE BODY OF THE PAGE</p>
                }
                </Col>
            </Row>
            </Jumbotron>
          </>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default StudentHomePage;