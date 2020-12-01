/**
 * Lecture object used to keep track of information about a lecture offered by the university
 * 
 * @param lectureId an integer corresponding to the identifier of the lecture
 * @param courseId a string containing the idendifier of the course the lecture is part of
 * @param teacherId a string containing the identifier of the teacher in charge of the course and of the lecture
 * @param date a string containing the date in which the lecture takes place, in format DD/MM/YYYY
 * @param startingTime a string containing the hour at which the lesson starts, in format HH:MM
 * @param endingTime a string containing the hour at which the lesson ends, in format HH:MM
 * @param inPresence a boolean value that tells whether the lecture is in presence or through virtual classroom
 * @param classroomId a string containing the identifier of the classroom where the lecture takes place
 * @param numberOfSeats an integer corresponding to the number of already booked seats for the lecture
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