const moment = require('moment');

/**Allows to set a callback that runs at 23:59 of each day.
 * Optionally, for debug purpouses, it can take another parameter, in wich you specify the interval to test
 * @param callback function to execute
 * @param testInterval optional interval to test with
*/
function setMidnightTimer(callback, testInterval = -1) {
    const firstDeadLine = __getNextDeadline(testInterval);
    __recursiveTimer(callback, firstDeadLine, testInterval)
}


function __recursiveTimer(callback, time, testInterval = -1) {
    setTimeout(
        () => {
            if(callback != null){
                callback();
            }
            const nextDeadline = __getNextDeadline(testInterval);
            __recursiveTimer(callback, nextDeadline, testInterval);
        },
        time
    );
}


/**Return milliseconds to next deadline*/
function __getNextDeadline(testInterval = -1) {
    if (testInterval >= 0) return testInterval;
    const now = moment();
    const deadLine = moment().add(1, 'd').set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    const interval = deadLine.valueOf() - now.valueOf();
    return interval;
}

module.exports = setMidnightTimer;