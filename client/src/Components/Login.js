import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import API from '../api/API';

import OfficerAccount from '../api/OfficerAccount'



class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.submitted = false;
  }

  updateField = (name, value) => {
    this.setState({ [name]: value });
  }

  onChangeUsername = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  //Chekc if the password is valid
  onChangePassword = (event) => {
    event.target.setCustomValidity("");
    this.updateField(event.target.name, event.target.value);
  }


  handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
    } else {
      this.login(new OfficerAccount("", "", "", this.state.email, this.state.password));
    }
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
    if (this.state.submitted)
      return <Redirect to='/teacher-home' />; // TODO: funzionera quando sarà attivo il login
    return (
      <AuthContext.Consumer>
        {(context) => (
          <>
            {/*(context.authErr || !context.authUser) && <Redirect to="/login"></Redirect>  TODO: quando funzionera il login*/}
            <Container fluid>
              <Row>
                <Col>
                  <h1>Login</h1>
                  <br />
                  <Form method="POST" onSubmit={(event) => this.handleSubmit(event)}>
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" name="email" placeholder="Email" onChange={(ev) => this.onChangeUsername(ev)} required />
                    </Form.Group>

                    <Form.Group controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" name="password" placeholder="Password" onChange={(ev) => this.onChangePassword(ev)} required />
                    </Form.Group>

                    <Form.Group>
                      <Button variant="primary" type="submit">Login</Button>
                    </Form.Group>
                  </Form>

                </Col>
              </Row>
            </Container>
          </>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default Login;