import React from 'react';
import { AuthContext } from '../auth/AuthContext'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faParagraph } from '@fortawesome/free-solid-svg-icons'
import { Redirect } from 'react-router-dom';
import   P5 from 'p5';


import API from '../api/API';

const p5  = new P5(); // create a p5 instance 

class LoadDataView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.name = "";
        this.state.surname = "";
    }


    componentDidMount() {
        // when the component are mounted, we insert the load file button
        let loadButton = p5.createFileInput(this.handleFile); // create the button
        loadButton.parent("load-button-div"); // set the parent element in wich display the button
    }

    /**Callback in which we handle the choosen file*/
    handleFile(file) {
        console.log(file);
        if (file.name.endsWith(".csv")) { // checking if the file is a csv file
            p5.loadTable(file.data, "csv", "header", (csv) => { // callback to use the loaded file
              console.log(csv.getRowCount(), csv.getRow(0))
            });// load and parse the csv from the choosen file
        } else {
          alert("The choosen file is not a csv file");
        }
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
                            <div id="load-button-div"/>
                        </Jumbotron>
                    </>
                )}
            </AuthContext.Consumer>
        );
    }

}

export default LoadDataView;
