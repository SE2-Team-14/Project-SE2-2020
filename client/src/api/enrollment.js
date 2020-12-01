/**
 * Enrollment object used to keep track of information about the courses a student is enrolled in
 * 
 * @param courseId a string containing the identifier of the course the student is enrolled in
 * @param email a string containing the email of the student enrolled
 */
class Enrollment {
    constructor(courseId, email) {
        this.courseId = courseId;
        this.email = email;
    }
}

module.exports = Enrollment;