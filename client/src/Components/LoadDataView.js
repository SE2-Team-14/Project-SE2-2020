import React from 'react';
import { Jumbotron, Button, FormText } from 'react-bootstrap';
const Papa = require('papaparse');

const LoadDataView = () => {
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
        console.log("Student header");
        break;
      case teacherHeader:
        console.log("Teacher header");
        break;
      case enrollmentHeader:
        console.log("Enrollment header");
        break;
      case scheduleHeader:
        console.log("Schedule header");
        break;
      case coursesHeader:
        console.log("Course header");
        break;
      default:
        alert("The file does not contains students or the format is wrong!");
        break;
    }
      
  }

  const onChange = (file) => {
    let fileData = new FileReader();
    fileData.onload = handleFile;
    fileData.readAsText(file);
  }

  const onSubmit = async e => {
    e.preventDefault();
    //const formData = new FormData();
    //formData.append('file', file);

  };

  return (
    <Jumbotron className="text-center">
      <h4>Select a file to load data into the system </h4>
      <p></p>
      <input type="file" id="students" accept=".csv" onChange={e => onChange(e.target.files[0])} />
      <Button onClick={onSubmit}>Submit</Button>
    </Jumbotron>
  );
};

export default LoadDataView;
