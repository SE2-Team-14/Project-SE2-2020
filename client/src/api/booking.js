/**
 * Booking object used to keep track of information about bookings made by a student
 * 
 * @param studentId a string containing the identifier of the student that made the booking
 * @param lectureId an integer corresponding to the identifier of the lecture booked by the student
 * @param date a string containing the date in which the booking has been made, in format DD/MM/YYYY
 * @param startingTime a string containing the hour at which the booked lesson starts, in format HH:MM
 * @param month a string containing the month in which the booking has been made
 * @param week a string containing the week in which the booking has been made, expressed as an interval of two dates in format DD/MM/YYYY, Monday to Sunday
 */
class Booking {
    constructor(studentId, lectureId, date, startingTime, month, week) {
        this.studentId = studentId;
        this.lectureId = lectureId;
        this.date = date;
        this.startingTime = startingTime;
        this.month = month;
        this.week = week;

    }
}

module.exports = Booking;