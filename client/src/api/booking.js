class Booking {
    constructor (studentId, lectureId, date, startingTime, month, week) {
        this.studentId = studentId;
        this.lectureId = lectureId;
        this.date = date;
        this.startingTime = startingTime;
        this.month = month;
        this.week = week;

    }
}

module.exports = Booking;