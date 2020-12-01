/**
 * Course object used to keep track of information about a course offered by the university
 * 
 * @param courseId a string containing the identifier of the course
 * @param teacherId a string containing the identifier of the teacher in charge of the course. A course can by taught by only one teacher, while one teacher can be in charge of multiple courses.
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