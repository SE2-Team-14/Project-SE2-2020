class CancelledBookings {
    constructor (cancelledBookingId, studentId, lectureId, date) {
        this.cancelledBookingId = cancelledBookingId;
        this.studentId = studentId;
        this.lectureId = lectureId;
        this.date = date;
    }
}

module.exports = CancelledBookings;