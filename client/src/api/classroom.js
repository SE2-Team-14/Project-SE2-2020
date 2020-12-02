/**
 * Classroom object used to keep track of information about a classroom present in the system
 * 
 * @param classroom a string containing the identifier of the classroom, which doubles as its name (7i, 12, 1 are all possible values)
 * @param maxNumberOfSeats an integer corresponding to the maximum amount of seats the classroom can have, which in turn corresponds to the maximum amount of bookings that can be done for lessons that take place in the classroom
 */
class Classroom {
    constructor(classroom, maxNumberOfSeats) {
        this.classroom = classroom;
        this.maxNumberOfSeats = maxNumberOfSeats;
    }
}

module.exports = Classroom;