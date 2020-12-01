/**
 * Schedule object used in the component LessonsCalendar to render a specific lecture in the calendar
 * 
 * @param title a string containing the name of the course associated with the lecture in the schedule
 * @param startDate a string containing the starting hour of the scheduled lecture, in format DD/MM/YYYY T HH:MM
 * @param endDate a string containing the ending hour of the scheduled lecture, in format DD/MM/YYYY T HH:MM
 * @param color an hexadecimal value corresponding to the hash calculated with the course name and associated with the color shown in the calendar
 * 
 */
class Schedule {
    constructor(title, startDate, endDate, color) {
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.color = color;
    }
}

export default Schedule;