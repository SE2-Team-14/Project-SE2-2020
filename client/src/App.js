import React from 'react';
import './App.css';
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Redirect, Route, Link } from 'react-router-dom';
import { Switch } from 'react-router';
import { withRouter } from 'react-router-dom';

import Alert from "react-bootstrap/Alert";


import Header from './Components/Header';
import Login from './Components/Login';
import StudentHomePage from './Components/StudentHomePage';
import TeacherHomePage from './Components/TeacherHomePage';
import LectureList from './Components/LectureListView';


import { AuthContext } from './auth/AuthContext'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null
    }
  }

  /**Called during component construction*/
  componentDidMount() {
    //API.isAuthenticated().then(
    //(user) => {
    //this.setState({ authUser: user });
    //}
    //).catch((err) => {
    //this.setState({ authErr: err.errorObj });
    this.props.history.push("/login"); // TODO: for debug only, to be changed with the login page
    //});
  }


  handleErrors(err) {
    if (err) {
      if (err.status && err.status === 401) {
        this.setState({ authErr: err.errorObj });
        //this.props.history.push("/officer-registration"); // TODO: to be changed with the login page
      }
    }
  }



  //------------------------LOGIN LOGOUT-------------------------

  logout = () => {
    this.setState({ authUser: null })
    this.props.history.push("/login");
  }

  loginCallback = (user) => {
    console.log("Logged User : ", user);
    this.setState({authUser:user})
  }

  //------------------------RENDERING----------------------------

  render() {

    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout
    }

    return (
      <AuthContext.Provider value={value}>
        <Header logout={this.logout} />
        <Container fluid>
          <Switch>

            <Route exact path="/student-home">
              <Alert variant="success">Student Starting Page </Alert>
              <StudentHomePage></StudentHomePage>
              <Link to="/login">Login</Link>
            </Route>

            <Route exact path="/teacher-home">
              <Alert variant="success">Student Starting Page </Alert>
              <TeacherHomePage></TeacherHomePage>
              <Link to="/login">Login</Link>
            </Route>
            
            <Route exact path="/login">
              <Row className="vheight-100">
                <Col sm={4}></Col>
                <Col sm={4} className="below-nav">
                  <Alert variant="success"> Login Page </Alert>
                  <Login loginCallback={this.loginCallback}/>
                </Col>
              </Row>
            </Route>
            <Route exact path='/student-home/:studentId/bookable-lectures' render={(props)=> {
              let studentId = props.match.params.studentId;
              return(<LectureList studentId = {studentId}/>);
            }}/>
            <Route>
              <Redirect to='/student-home' />
            </Route>

          </Switch>

        </Container>
      </AuthContext.Provider>
    );
  }
}

export default withRouter(App);
