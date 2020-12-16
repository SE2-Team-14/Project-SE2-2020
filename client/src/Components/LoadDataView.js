import React from 'react';
import { Jumbotron, Button, Modal, Spinner } from 'react-bootstrap';
import API from '../api/API';

const moment = require('moment');

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
    loading: false,
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
    this.setState({ loading: true });
    API.fileLoader(this.state.fileData, this.state.fileType).then(() => this.setState({ showUploadSuccess: true, selectedFile: null, loading: false }));
  };

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <p> </p>
          <h4>File Details:</h4>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Size: {(this.state.selectedFile.size / 1024).toFixed(2)}Kb</p>
          <p>Last Modified: {moment(this.state.selectedFile.lastModified).format("YYYY-MM-DD HH:mm")}</p>
        </div>
      );
    }
  };

  render() {
    return (
      <Jumbotron className="text-center">
        <h3>Select a file to load data into the system </h3>
        <p></p>
        <div>
          <div className='custom-file mb-4 col-sm-3'>
            <input type='file' className='custom-file-input' id='customFile'
              accept=".csv"
              onChange={this.onChange}
            />
            <label className='custom-file-label' htmlFor='customFile'>
              {this.state.fileName}
            </label>
            <p></p>
          </div>
        </div>

        {(this.state.loading == false) &&
          <>
            <Button onClick={this.onSubmit}>Upload!</Button>
          </>
        }
        {(this.state.loading == true) &&
          <>
            <Button disabled>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
            {" "}Loading</Button>
          </>

        }

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
        {this.fileData()}
      </Jumbotron>
    );
  }
}

export default LoadDataView;
