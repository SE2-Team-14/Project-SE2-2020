import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { AuthContext } from '../auth/AuthContext'
import { NavLink } from 'react-router-dom';


const Header = (props) => {


  return (

    <AuthContext.Consumer>
      {(context) => (

        <Navbar bg="info" variant="dark" expand="md" className='col-12'>

          {context.authUser == null && <Navbar.Brand as={NavLink} to="/login">
            PULSeBS
          </Navbar.Brand>}
          {(context.authUser != null && context.authUser.role === "Student") && <Navbar.Brand as={NavLink} to={`/student-home/${context.authUser.email}`}>
            PULSeBS
          </Navbar.Brand>}
          {(context.authUser != null && context.authUser.role === "Teacher") && <Navbar.Brand as={NavLink} to={`/teacher-home/${context.authUser.email}`}>
            PULSeBS
          </Navbar.Brand>}
          <Nav className="mr-auto">
            {(context.authUser != null && context.authUser.role === "Student") && <Nav.Link as={NavLink} to={`/student-home/${context.authUser.email}/bookable-lectures`}>Bookable Lectures</Nav.Link>}
            {(context.authUser != null && context.authUser.role === "Student") && <Nav.Link as={NavLink} to={`/student-home/${context.authUser.email}/booked-calendar`}>My booked lectures</Nav.Link>}
            {(context.authUser != null && context.authUser.role === "Teacher") && <Nav.Link as={NavLink} to={`/teacher-home/${context.authUser.email}/booked-lectures`} >Booked Lectures</Nav.Link>}
            {(context.authUser != null && context.authUser.role === "Teacher") && <Nav.Link as={NavLink} to={`/teacher-home/${context.authUser.email}/manage-lectures`} >Manage Lectures</Nav.Link>}
          </Nav>
          <Nav className="ml-md-auto">
            {context.authUser &&
              <>
                <Navbar.Brand>{context.authUser.email}</Navbar.Brand>
                <Nav.Link onClick={() => { props.logout() }}>Logout</Nav.Link>
              </>}
            {!context.authUser && <Nav.Link as={NavLink} to="/login">Login</Nav.Link>}
            <svg className="bi bi-people-circle" width="30" height="30" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 008 15a6.987 6.987 0 005.468-2.63z" />
              <path fillRule="evenodd" d="M8 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8z" clipRule="evenodd" />
            </svg>
          </Nav>

        </Navbar>

      )
      }
    </AuthContext.Consumer >
  );
}

export default Header;
