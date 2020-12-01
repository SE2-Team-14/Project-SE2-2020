/**
 * Lecture object containing information about a lecture offered by the university
 * @param lectureId an integer corresponding to the identifier of the lecture
 * @param courseId a string containing the identifier of the course associated to the lecture
 * @param teacherId a string containing the identifier of the teacher in charge of the course and of the lecture
 * @param date a string containing the date in which the lesson takes place, in format DD/MM/YYYY
 * @param startingTime a string containing the hour in which the lesson starts, in format HH:MM
 * @param endingTime a string containing the hour in which the lesson ends, also in format HH:MM (lesson blocks of three hours, like for example 8:30-10:00 and 10:00-11:30, are considered by the system as a unique block instead of two separate ones (8:30-11:30))
 * @param inPresence a boolean value that specifies if the lesson is done in presence or through a virtual classroom
 * @param classroomId a string containing the identifier of the classroom in which the lesson takes place
 * @param numberOfSeats an integer containing the amount of seats currently booked by students
 */
class Lecture {
    constructor(lectureId, courseId, teacherId, date, startingTime, endingTime, inPresence, classroomId, numberOfSeats) {
        this.lectureId = lectureId;
        this.courseId = courseId;
        this.teacherId = teacherId;
        this.date = date;
        this.startingTime = startingTime;
        this.endingTime = endingTime;
        this.inPresence = inPresence;
        this.classroomId = classroomId;
        this.numberOfSeats = numberOfSeats;
    }
}

module.exports = Lecture;