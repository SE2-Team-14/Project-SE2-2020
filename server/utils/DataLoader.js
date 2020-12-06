const fs = require('fs');
const Papa = require('papaparse');

const Person = require('../bean/person');
const PersonDao = require('../dao/person_dao');

class DataLoader{

    async readStudentsCSV (filePath) {
        const csvFile = fs.readFileSync(filePath)
        const csvData = csvFile.toString()  
        return new Promise(resolve => {
            Papa.parse(csvData, {
                header: true,
                complete: results => {
                    for(let i=0; i<results.data.length; i++){
                        let dataStudent = results.data[i];
                        let student = new Person(
                            dataStudent.Id,
                            dataStudent.Name,
                            dataStudent.Surname, 
                            "Student",
                            dataStudent.OfficialEmail, 
                            "team14",
                            dataStudent.City, 
                            dataStudent.Birthday,
                            dataStudent.SSN
                        );
                        PersonDao.createPerson(student);
                    }
                    console.log('Complete', results.data.length, 'records.'); 
                    resolve(results.data);
            }
            });
        });
    };

    async readTeachersCSV (filePath) {
        const csvFile = fs.readFileSync(filePath)
        const csvData = csvFile.toString()  
        return new Promise(resolve => {
            Papa.parse(csvData, {
                header: true,
                complete: results => {
                    for(let i=0; i<results.data.length; i++){
                        let dataTeacher = results.data[i];
                        let teacher = new Person(
                            dataTeacher.Number,
                            dataTeacher.GivenName,
                            dataTeacher.Surname, 
                            "Teacher",
                            dataTeacher.OfficialEmail, 
                            "team14",
                            null, 
                            null,
                            dataTeacher.SSN
                        );
                        PersonDao.createPerson(teacher);
                        console.log(dataTeacher);
                    }
                    console.log('Complete', results.data.length, 'records.'); 
                    resolve(results.data);
            }
            });
        });
    };
}

module.exports = DataLoader;