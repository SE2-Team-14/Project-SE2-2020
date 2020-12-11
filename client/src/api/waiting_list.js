/**
 * WaitingList object that contains information about stundents that wants to be put in a waiting list if there are no seats left in the classroom
 * @param stundetId a string containing the identifier of the student
 * @param lessonId a string containing the id of the lesson
 * @param bookingDate a string containing the date when the student requested to be put in waiting list
 * @param bookingTime a string containing the time when the student requested to be put in waiting list
 */
class WaitingList {
    constructor(studentId, lessonId, bookingDate, bookingTime) {
        this.studentId = studentId;
        this.lessonId = lessonId;
        this.bookingDate = bookingDate;
        this.bookingTime = bookingTime;
    }
}

module.exports = WaitingList;