import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import API from '../api/API';

import Person from '../api/Person';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.submitted = false;
  }

  /**
   * Called when the user inserts a new parameter in the form (username, password)
   * @param name a string containing the name of the parameter to be updated
   * @param value a string containing the value of the parameter to be updated
   */
  updateField = (name, value) => {
    this.setState({ [name]: value });
  }

  /**
   * Called when the user inserts a new username in the form
   * @param event an Object containing information about the insertion event, including name of the changed element and changed value
   */
  onChangeUsername = (event) => {
    this.updateField(event.target.name, event.target.value);
  };

  /**
   * Called when the user inserts a new password in the form
   * @param event an Object containing information about the insertion event, including name of the changed element and changed value
   * 
   * Have to check if the password is valid
   */
  onChangePassword = (event) => {
    event.target.setCustomValidity("");
    this.updateField(event.target.name, event.target.value);
  }

  /**
   * Called when the user chooses to submit the form, checks if the form is valid with all parameters inserted correctly and, if they are, performs login
   * @param event an Object containing information about the submission event
   */
  handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
    } else {
      this.login(new Person("", "", "", "", this.state.email, this.state.password));
    }
  }

  /**
   * Calls the API that checks if email and password inserted are of a user registered in the database.
   * Allows access if they are correct and shows and error message if they aren't.
   * @param user a Person object containing email and password of the user that is trying to log into the system
   */
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

  /**
   * Renders the form that implements the login to the application.
   * After a successful login redirects a user to the appropriate homepage based on his role: Student, Teacher, Officer, Manager(not yet implemented)
   */
  render() {
    return (
      <AuthContext.Consumer>
        {(context) => (
          <>
            {(context.authErr || !context.authUser) && <Redirect to="/login"></Redirect>}
            {this.state.submitted && (context.authUser != null && context.authUser.role === "Teacher")
              && <Redirect to={`/teacher-home/${context.authUser.email}`} />}
            {this.state.submitted && (context.authUser != null && context.authUser.role === "Student")
              && <Redirect to={`/student-home/${context.authUser.email}`} />}
            {this.state.submitted && (context.authUser != null && context.authUser.role === "Manager")
              && <Redirect to={`/manager-home/${context.authUser.email}`} />}
            {this.state.submitted && (context.authUser != null && context.authUser.role === "SupportOfficer")
              && <Redirect to={`/support-officer-home/${context.authUser.email}/loader`} />}
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