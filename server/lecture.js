class Lecture {
    constructor (courseId, teacherId, date, startingTime, endingTime, inPresence, classroom) {
        this.courseId = courseId;
        this.teacherId = teacherId;
        this.date = date;
        this.startingTime = startingTime;
        this.endingTime = endingTime;
        this.inPresence = inPresence;
        this.classroom = classroom;
    }
}

module.exports = Lecture;