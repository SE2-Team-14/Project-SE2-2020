import React from 'react';
import './App.css';
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Redirect, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import { withRouter } from 'react-router-dom';
import API from './api/API';

import Header from './Components/Header';
import Login from './Components/Login';
import StudentHomePage from './Components/StudentHomePage';
import TeacherHomePage from './Components/TeacherHomePage';
import LectureListView from './Components/LectureListView';
import BookedStudentsList from "./Components/BookedStudentsList";
<<<<<<< HEAD
import TeacherStatsViewer from "./Components/TeacherStatsViewer";
=======
import ManageLectureList from './Components/ManageLectureList';
import BookedLessonsCalendar from './Components/LessonsCalendar';
>>>>>>> 99d2b8938220d5fe4049dfa1be10a03bd6cac0b1

import { AuthContext } from './auth/AuthContext'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      teachers: [],
      classrooms: [],
      authUser: null
    }
  }

  /**Called during component construction*/
  componentDidMount() {
    API.getCoursesNames().then((courses) => this.setState({ courses: courses }));
    API.getTeachers().then((teachers) => this.setState({ teachers: teachers }));
    API.getClassrooms().then((classrooms) => this.setState({ classrooms: classrooms }));
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
    this.setState({ authUser: user })
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

            <Route exact path="/student-home/:email" render={(props) => {
              let email = props.match.params.email;
              return (<StudentHomePage email={email}></StudentHomePage>)
            }}>
            </Route>

            <Route exact path="/teacher-home/:email" render={(props) => {
              let email = props.match.params.email;
              return (<TeacherHomePage email={email}></TeacherHomePage>)
            }}>
            </Route>

            <Route exact path="/student-home/:email/booked-calendar" render={(props) => {
              let email = props.match.params.email;
              return (<BookedLessonsCalendar email={email}></BookedLessonsCalendar>)
            }}>
            </Route>

            <Route exact path="/login">
              <Row className="vheight-100">
                <Col sm={4}></Col>
                <Col sm={4} className="below-nav">
                  <Login loginCallback={this.loginCallback} />
                </Col>
              </Row>
            </Route>
            <Route exact path='/student-home/:email/bookable-lectures' render={(props) => {
              let email = props.match.params.email;
              return (<LectureListView id={this.state.authUser.id} email={email} courses={this.state.courses} teachers={this.state.teachers} classrooms={this.state.classrooms} />);
            }} />
            <Route exact path="/teacher-home/:email/booked-lectures" render={(props) => {
              let email = props.match.params.email;
              return (<BookedStudentsList email={email}></BookedStudentsList>)
            }}>
            </Route>
            <Route exact path="/teacher-home/:email/statistics" render={(props) => {
              let email = props.match.params.email;
              return (<TeacherStatsViewer email={email}></TeacherStatsViewer>)
            }}></Route>
            <Route exact path='/teacher-home/:email/manage-lectures' render={(props) => {
              let email = props.match.params.email;
              return (<ManageLectureList email={email} id={this.state.authUser.id} courses={this.state.courses} classrooms={this.state.classrooms}></ManageLectureList>)
            }}></Route>
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