const { max } = require("moment");

/**
 * Classroom object used to save information about a classroom in the university
 * @param classroom a string containing the id of the classroom, which also doubles as the name of the classroom (7i, 12, 1 are all valid examples)
 * @param maxNumberOfSeats an integer corresponding to the maximum number of seats(and as a consequence of booked students) the classroom can have
 */
class Classroom {
    constructor(classroom, maxNumberOfSeats) {
        this.classroom = classroom;
        this.maxNumberOfSeats = maxNumberOfSeats;
    }
}

module.exports = Classroom;