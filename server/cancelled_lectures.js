class CancelledLectures {
    constructor (cancelledLectureId, courseId, teacherId, date, inPresence) {
        this.cancelledLectureId = cancelledLectureId;
        this.courseId = courseId;
        this.teacherId = teacherId;
        this.date = date;
        this.inPresence = inPresence;
    }
}

module.exports = CancelledLectures;