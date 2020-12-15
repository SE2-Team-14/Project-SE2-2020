import React from 'react';
import axios from 'axios';
import Message from './Message';
import { Jumbotron, Button } from 'react-bootstrap';
import API from '../api/API';

const Papa = require('papaparse');

const studentHeader = "Id,Name,Surname,City,OfficialEmail,Birthday,SSN";
const teacherHeader = "Number,GivenName,Surname,OfficialEmail,SSN";
const enrollmentHeader = "Code,Student";
const scheduleHeader = "Code,Room,Day,Seats,Time";
const coursesHeader = "Code,Year,Semester,Course,Teacher";

class LoadDataView extends React.Component {

  state = {
    // Initially, no file is selected 
    selectedFile: null,
    fileType: "",
    fileData: "",
  };

  handleFile = (e) => {
    const content = e.target.result.toString();
    let header = "";

    Papa.parse(content, {
      header: false,
      complete: results => {
        header = results.data[0]
      }
    })

    this.setState({fileData: content});

    switch (header.join(",")) {
      case studentHeader:
        this.setState({ fileType: "student" });
        break;
      case teacherHeader:
        this.setState({ fileType: "teacher" });
        break;
      case enrollmentHeader:
        this.setState({ fileType: "enrollment" });
        break;
      case scheduleHeader:
        this.setState({ fileType: "schedule" });
        break;
      case coursesHeader:
        this.setState({ fileType: "course" });
        break;
      default:
        alert("The file does not contains students or the format is wrong!");
        break;
    }
  }

  onChange = e => {
    let file = e.target.files[0]
    let fileData = new FileReader();
    fileData.onloadend = this.handleFile;
    fileData.readAsText(file);
    this.setState({ selectedFile: file });
  }

  onSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.fileData)
    API.fileLoader(this.state.fileData, this.state.fileType);
    
  };

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <p> </p>
          <h4>File Details:</h4>
          <p>File Name: {this.state.selectedFile.name}</p>
        </div>
      );
    }
  };

  render() {
    return (
      <Jumbotron className="text-center">
        <h4>Select a file to load data into the system </h4>
        <p></p>
        <div>
          <input type="file" accept=".csv" onChange={this.onChange} />
          <Button onClick={this.onSubmit}>Upload!</Button>
        </div>
        {this.fileData()}
      </Jumbotron>
    );
  }
};

export default LoadDataView;
