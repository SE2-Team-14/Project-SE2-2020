import React from 'react';
import Message from './Message';
import { Jumbotron, Button, Modal } from 'react-bootstrap';
import API from '../api/API';

const Papa = require('papaparse');

const studentHeader = "Id,Name,Surname,City,OfficialEmail,Birthday,SSN";
const teacherHeader = "Number,GivenName,Surname,OfficialEmail,SSN";
const enrollmentHeader = "Code,Student";
const scheduleHeader = "Code,Room,Day,Seats,Time";
const coursesHeader = "Code,Year,Semester,Course,Teacher";

class LoadDataView extends React.Component {

  state = {
    selectedFile: null,
    fileType: "",
    fileData: "",
    fileName: "", 
    showUploadSuccess: false,
    showUpdateError: false,
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

    this.setState({ fileData: content });

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
        this.setState({ showUpdateError: true });
        break;
    }
  }

  onChange = e => {
    let file = e.target.files[0]
    let fileData = new FileReader();
    fileData.onloadend = this.handleFile;
    fileData.readAsText(file);
    this.setState({ selectedFile: file, fileName: file.name });
  }

  handleClose = () => {
    this.setState({ showUploadSuccess: false, showUpdateError: false, fileName: "", selectedFile: null });
  }

  onSubmit = (e) => {
    e.preventDefault();
    API.fileLoader(this.state.fileData, this.state.fileType).then(() => this.setState({ showUploadSuccess: true, selectedFile: null }));
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
          <Modal controlid='Success' show={this.state.showUploadSuccess} onHide={this.handleClose} animation={false} >
            <Modal.Header closeButton>
              <Modal.Title>Upload successfull!</Modal.Title>
            </Modal.Header>
            <Modal.Body>The file {this.state.fileName} has been successfully uploaded</Modal.Body>
            <Modal.Footer>
              <Button variant='primary' onClick={this.handleClose}>OK</Button>
            </Modal.Footer>
          </Modal>
          <Modal controlid='Error' show={this.state.showUpdateError} onHide={this.handleClose} animation={false} >
            <Modal.Header closeButton>
              <Modal.Title>Error uploading file</Modal.Title>
            </Modal.Header>
            <Modal.Body>There was a problem loading the file or the cvs format is wrong</Modal.Body>
            <Modal.Footer>
              <Button variant='primary' onClick={this.handleClose}>OK</Button>
            </Modal.Footer>
          </Modal>

        </div>
        {this.fileData()}
      </Jumbotron>
    );
  }
}

export default LoadDataView;
