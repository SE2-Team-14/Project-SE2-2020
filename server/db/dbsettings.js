/**
 * Class used to set which database is being used.
 * The database used depends on whether tests are running or not.
 */
class settings {
    constructor() {
        this.test = false;
    }
}

module.exports = settings;