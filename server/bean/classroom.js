const { max } = require("moment");

class Classroom {
    constructor (classroom, maxNumberOfSeats) {
        this.classroom = classroom;
        this.maxNumberOfSeats = maxNumberOfSeats;
    }
}

module.exports = Classroom;