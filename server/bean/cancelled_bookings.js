/**
 * Cancelled Booking object corresponding to a booking for a lecture that was deleted by a student
 * @param cancelledBookingId an integer identifying the cancelled booking
 * @param studentId a string corresponding to the id of the student that booked a seat for the lecture and then deleted it
 * @param lectureId an integer corresponding to the id of the lecture for which the student deleted the booking
 * @param date a string containing the date in which the student deleted the booking, in format DD/MM/YYYY
 */
class CancelledBookings {
    constructor(cancelledBookingId, studentId, lectureId, date) {
        this.cancelledBookingId = cancelledBookingId;
        this.studentId = studentId;
        this.lectureId = lectureId;
        this.date = date;
    }
}

module.exports = CancelledBookings;