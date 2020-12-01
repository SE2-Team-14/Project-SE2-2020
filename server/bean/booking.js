/**
 * Booking object used to save the booking made by a student for a specific lecture
 * @param studentId a string containing the id of the student that made the booking
 * @param lectureId an integer corresponding to the id of the booked lecture
 * @param date a string containing the date in which the booking was made, in format DD/MM/YYYY
 * @param startingTime a string containing the starting time of the booked lecture
 */
class Booking {
    constructor(studentId, lectureId, date, startingTime) {
        this.studentId = studentId;
        this.lectureId = lectureId;
        this.date = date;
        this.startingTime = startingTime;
    }
}

module.exports = Booking;