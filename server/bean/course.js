/**
 * Course object containing information about a course offered by the university
 * @param courseId a string containing the identifier of the course
 * @param teacherId a string containing the identifier of the teacher in charge of the course (a course can be taught by only one teacher, but a teacher can teach multiple courses)
 * @param name a string containing the name of the course
 */
class Course {
    constructor(courseId, teacherId, name) {
        this.courseId = courseId;
        this.teacherId = teacherId;
        this.name = name;
    }
}

module.exports = Course;