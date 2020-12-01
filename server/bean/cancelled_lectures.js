/**
 * Cancelled Lecture object corresponding to a lecture that was deleted by a teacher
 * @param cancelledLectureId an integer that identifies the deleted lecture
 * @param courseId a string containing the id of the course the deleted lecture is part of
 * @param teacherId a string containing the id of the teacher that teaches the course (also the teacher that deletes the lecture)
 * @param date a string containing the date in which the lecture would have taken place if it hadn't been deleted, in format DD/MM/YYYY
 * @param inPresence a boolean value that identifies if the lecture was in presence or not before being deleted
 */
class CancelledLectures {
    constructor(cancelledLectureId, courseId, teacherId, date, inPresence) {
        this.cancelledLectureId = cancelledLectureId;
        this.courseId = courseId;
        this.teacherId = teacherId;
        this.date = date;
        this.inPresence = inPresence;
    }
}

module.exports = CancelledLectures;