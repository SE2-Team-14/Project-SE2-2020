import React, { useState } from 'react';
import axios from 'axios';
import { Jumbotron, Button } from 'react-bootstrap';

const Papa = require('papaparse');

const LoadDataView = () => {
  const [file, setFile] = useState("");
  const [inputType, setFileType] = useState("");
  const [filename, setFilename] = useState('Choose File');

  const studentHeader = "Id,Name,Surname,City,OfficialEmail,Birthday,SSN";
  const teacherHeader = "Number,GivenName,Surname,OfficialEmail,SSN";
  const enrollmentHeader = "Code,Student";
  const scheduleHeader = "Code,Room,Day,Seats,Time";
  const coursesHeader = "Code,Year,Semester,Course,Teacher";

  const handleFile = (e) => {
    const content = e.target.result.toString();
    let header = "";

    Papa.parse(content, {
      header: false,
      complete: results => {
        header = results.data[0]
      }
    })

    switch (header.join(",")) {
      case studentHeader:
        setFileType("student");
        break;
      case teacherHeader:
        setFileType("teacher");
        break;
      case enrollmentHeader:
        setFileType("enrollment");
        break;
      case scheduleHeader:
        setFileType("schedule");
        break;
      case coursesHeader:
        setFileType("course");
        break;
      default:
        alert("The file does not contains students or the format is wrong!");
        break;
    }
  }

  const onChange = (e) => {
    let file = e.target.files[0]
    let fileData = new FileReader();
    fileData.onloadend = handleFile;
    fileData.readAsText(file);

    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  }

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`/upload/${inputType}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        console.log('There was a problem with the server');
      } else {
        console.log(err.response.data.msg);
      }
    }
  };

  return (
    <Jumbotron className="text-center">
      <h4>Select a file to load data into the system </h4>
      <p></p>
      <input type="file" id="students" accept=".csv" onChange={onChange} />
      <Button onClick={onSubmit}>Submit</Button>
    </Jumbotron>
  );
};

export default LoadDataView;
