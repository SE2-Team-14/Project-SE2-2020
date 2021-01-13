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
import ContactTracing from './Components/ContactTracing';
import HomePage from "./Components/HomePage";
import LectureListView from './Components/LectureListView';
import BookedStudentsList from "./Components/BookedStudentsList";
import ManageLectureList from './Components/ManageLectureList';
import BookedLessonsCalendar from './Components/LessonsCalendar';
import StatsViewer from "./Components/StatsViewer";
import LoadDataView from "./Components/LoadDataView";
import RecordAttendance from "./Components/RecordAttendance";
import UpdateBookableLecture from './Components/UpdateBookableLecture';
import ModifyLectureList from './Components/ModifyLectureList';

import { AuthContext } from './auth/AuthContext'
import Tutorial from './Components/Tutorial';
//import DynamicBackground from './Components/DynamicBackground';

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
    this.props.history.push("/login");
    //});
  }


  handleErrors(err) {
    if (err) {
      if (err.status && err.status === 401) {
        this.setState({ authErr: err.errorObj });
        this.props.history.push("/login");
      }
    }
  }

  //------------------------LOGIN LOGOUT-------------------------

  logout = () => {
    this.setState({ authUser: null })
    this.props.history.push("/login");
    window.birthday = false;
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
        {
          // !this.state.authUser && <Redirect to="/login"></Redirect> // if there is no user in the system, redirect to the login page
        }
        <Header logout={this.logout} />
        <Container fluid>
          <Switch>

            <Route exact path="/student-home/:email" render={(props) => {
              let email = props.match.params.email;
              return <>{this.state.authUser && <HomePage email={email} id={this.state.authUser.id} courses={this.state.courses} teachers={this.state.teachers} classrooms={this.state.classrooms}></HomePage>}</>
            }}>
            </Route>

            <Route exact path="/teacher-home/:email" render={(props) => {
              let email = props.match.params.email;
              return <>{this.state.authUser && <HomePage email={email} id={this.state.authUser.id} courses={this.state.courses} teachers={this.state.teachers} classrooms={this.state.classrooms}></HomePage>}</>
            }}>
            </Route>

            <Route exact path="/student-home/:email/booked-calendar" render={(props) => {
              let email = props.match.params.email;
              return <>{this.state.authUser && <BookedLessonsCalendar email={email} studentId={this.state.authUser.id} courses={this.state.courses}></BookedLessonsCalendar>} </>
            }}>
            </Route>

            <Route exact path="/manager-home/:email" render={(props) => {
              let email = props.match.params.email;
              return <>{this.state.authUser &&
                <>
                  <HomePage email={email}></HomePage>
                  <StatsViewer email={email} role="Manager"></StatsViewer>
                </>}
              </>
            }}>
            </Route>

            <Route exact path="/student-home/:email/tutorial" render={(props) => {
              return <Tutorial role="Student"/>
            }}>
            </Route>

            <Route exact path="/teacher-home/:email/tutorial" render={(props) => {
              return <Tutorial role="Teacher"/>
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


            <Route exact path="/manager-home/:email/contact-tracing">
              <Row className="vheight-100">
                <Col sm={4}></Col>
                <Col sm={4} className="below-nav">
                  <ContactTracing />
                </Col>
              </Row>
            </Route>

            <Route exact path='/student-home/:email/bookable-lectures' render={(props) => {
              //let email = props.match.params.email;
              return <>{this.state.authUser && <LectureListView id={this.state.authUser.id} email={this.state.authUser.email} courses={this.state.courses} teachers={this.state.teachers} classrooms={this.state.classrooms} />}</>;
            }} />

            <Route exact path="/teacher-home/:email/booked-lectures" render={(props) => {
              let email = props.match.params.email;
              return <>{this.state.authUser && <BookedStudentsList email={email}></BookedStudentsList>}</>
            }}>
            </Route>

            <Route exact path="/teacher-home/:email/statistics" render={(props) => {
              let email = props.match.params.email;
              return <>{this.state.authUser && <StatsViewer email={email} role="Teacher"></StatsViewer>}</>
            }}></Route>

            <Route exact path='/teacher-home/:email/manage-lectures' render={(props) => {
              let email = props.match.params.email;
              return <>{this.state.authUser && <ManageLectureList email={email} id={this.state.authUser.id} courses={this.state.courses} classrooms={this.state.classrooms}></ManageLectureList>}</>
            }}></Route>

            <Route exact path="/teacher-home/:email/attendance" render={(props) => {
              let email = props.match.params.email;
              return <>{this.state.authUser && <RecordAttendance email={email} id={this.state.authUser.id}></RecordAttendance>}</>
            }}></Route>

            <Route exact path='/support-officer-home/:email/loader' render={(props) => {
              return <>{this.state.authUser && <LoadDataView></LoadDataView>}</>
            }}></Route>

            <Route exact path='/support-officer-home/:email/updateLectures' render={(props) => {
              return <>{this.state.authUser && <UpdateBookableLecture></UpdateBookableLecture>}</>
            }}></Route>

            <Route exact path='/support-officer-home/:email/modify' render={(props) => {
              let email = props.match.params.email;
              return <>{this.state.authUser && <ModifyLectureList email={email} id={this.state.authUser.id} courses={this.state.courses} classrooms={this.state.classrooms}></ModifyLectureList>}</>
            }}></Route>
            <Route exact path="/load">
              <Row className="vheight-100">
                <Col sm={4}></Col>
                <Col sm={4} className="below-nav">
                </Col>
              </Row>
            </Route>

            <Route>
              <Redirect to='/login' />
            </Route>

          </Switch>
        </Container>
      </AuthContext.Provider >
    );
  }
}

export default withRouter(App);
