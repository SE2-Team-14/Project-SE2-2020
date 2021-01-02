class Schedule_Update {
    constructor(courseId, classroom, dayOfWeek, numberOfSeats, startingTime, endingTime) {
        this.courseId = courseId;
        this.classroom = classroom;
        this.dayOfWeek = dayOfWeek;
        this.numberOfSeats = numberOfSeats;
        this.startingTime = startingTime;
        this.endingTime = endingTime;
    }
}

module.exports = Schedule_Update;