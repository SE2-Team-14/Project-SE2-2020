import React from 'react';
import { AuthContext } from '../auth/AuthContext'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faParagraph } from '@fortawesome/free-solid-svg-icons'
import { Redirect } from 'react-router-dom';


import API from '../api/API';


class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.name = "";
        this.state.surname = "";
    }

    /**
     * Retrieves, using the email used to access the system, a Person object containing name and surname of the logged in user
     */
    componentDidMount() {
        API.getPersonName(this.props.email).then((person) => {
            this.setState({ name: person.name, surname: person.surname })
        })
    }

    /**
     * Renders a welcome message, showing name and surname of the logged in user with some generic icons on the sides of the page. Very stilish,
     */
    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {(context.authErr || !context.authUser) && <Redirect to="/login"></Redirect>}
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
                    </>
                )}
            </AuthContext.Consumer>
        );
    }
    /** 
     * When we decide to implement particular features in different homepages we can pass a string containing the role of the person when calling this component from App.js
     * (<HomePage email={email} role="Teacher" />), with possible roles being Student or Teacher
     * No use for passing the role of Manager since there's a Component for that already
     */
}

export default HomePage;
