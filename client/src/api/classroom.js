const { max } = require("moment");

class Classroom {
    constructor (name, maxNumberOfSeats) {
        this.name = name;
        this.maxNumberOfSeats = maxNumberOfSeats;
    }
}

module.exports = Classroom;