/**
 * Enrollment object containing information about how a student is enrolled in a course
 * @param courseId a string containing the identifier of the course a student is enrolled in
 * @param email a string containing the email of the student who is enrolled in a course
 */
class Enrollment {
    constructor(courseId, id) {
        this.courseId = courseId;
        this.id = id;
    }
}

module.exports = Enrollment;