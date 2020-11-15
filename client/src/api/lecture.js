class Lecture {
    constructor (lectureId, courseId, teacherId, date, startingTime, endingTime, inPresence, classroomId, numberOfSeats) {
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