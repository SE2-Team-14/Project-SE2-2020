import React from 'react';
import Paper from '@material-ui/core/Paper';
import moment from 'moment'
import { AuthContext } from '../auth/AuthContext'
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  TodayButton,
  ViewSwitcher,
  MonthView,
  DayView,
  Resources,
} from '@devexpress/dx-react-scheduler-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import API from '../api/API';
import Schedule from '../api/schedule'
import ColorResources from '../api/ColorResource';
import Instances from '../api/Instance'

const style = theme => ({
  todayCell: {
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.14),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
  },
  weekendCell: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    '&:hover': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
  },
  today: {
    backgroundColor: fade(theme.palette.primary.main, 0.16),
  },
  weekend: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
  },
});

const TimeTableCellBase = ({ classes, ...restProps }) => {
  const { startDate } = restProps;
  const date = new Date(startDate);

  if (date.getDate() === new Date().getDate())
    return <WeekView.TimeTableCell {...restProps} className={classes.todayCell} />;

  if (date.getDay() === 0 || date.getDay() === 6)
    return <WeekView.TimeTableCell {...restProps} className={classes.weekendCell} />;

  return <WeekView.TimeTableCell {...restProps} />;
};

const TimeTableCell = withStyles(style, { name: 'TimeTableCell' })(TimeTableCellBase);

const DayScaleCellBase = ({ classes, ...restProps }) => {
  const { startDate, today } = restProps;

  if (today)
    return <WeekView.DayScaleCell {...restProps} className={classes.today} />;

  if (startDate.getDay() === 0 || startDate.getDay() === 6)
    return <WeekView.DayScaleCell {...restProps} className={classes.weekend} />;

  return <WeekView.DayScaleCell {...restProps} />;
};

const DayScaleCell = withStyles(style, { name: 'DayScaleCell' })(DayScaleCellBase);

let titles = [];

class LessonsCalendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(),
      bookings: [],
      lectures: [],
      schedulerLectures: [],
      resources: [],
    };  
  }

  /**
   * Sets the function that will be used to change the current date shown by the calendar
   * Calls the API that retrieves all bookings of the logged student
   */
  componentDidMount() {
    this.currentDateChange = (currentDate) => { this.setState({ currentDate }); };
    API.getBookings(this.props.studentId).then((bookings) => this.setState({ bookings: bookings }, () => this.findDates()));
  }
  
  /**
   * Returns the name of the course having the associated identifier
   * @param courseId a string containing the identifier of the course whose name is to be returned
   */
  findCourseName = (courseId) => {
    let course = this.props.courses.find((c) => c.courseId == courseId);
    return course.name;
  }

  /**
   * Calculates, for all future lessons booked by the student, an array schedule data made objects, each one made of
   *  - name of the course
   *  - starting hour of the lesson (with also the date)
   *  - ending hour of the lesson
   * Then calls the function that generates the color resources associated with each schedule element
   */
  findDates = () => {
    let schedulerData_ = [];

    for (let b of this.state.bookings) {
      API.getLectureById(b.lectureId).then((lectures) => {
        let bschedule = Object.assign({}, Schedule);

        let date = moment(lectures.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
        let startingHours = moment(lectures.startingTime, 'HH:mm').format('HH:mm');
        let endingHours = moment(lectures.endingTime, 'HH:mm').format('HH:mm');
        let start = date + 'T' + startingHours;
        let end = date + 'T' + endingHours;
        let courseName = this.findCourseName(lectures.courseId)
        let titleOb = new Object({courseName: '', classroom: ''});
        titleOb.courseName = courseName;
        titleOb.classroom = lectures.classroomId;
        titles.push(titleOb);
        bschedule.title = courseName;
        bschedule.startDate = start;
        bschedule.endDate = end;

        schedulerData_.push(bschedule);
        this.setState({ schedulerLectures: schedulerData_ }, () => this.generateResources())
      })
    }
  }

  /**
   * Calculates the hash value of a given string, corresponding to a name of a course
   * @param str a string containing the name of the course whose hash has to be computed
   */
  hashCode = (str) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++)
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return hash;
  }

  /**
   * Calculates the logical AND between a mask and a hash value and then returns an hexadecimal value. Said value is the color associated with the name of a course, making it so that every course has a different, unique color associated.
   * @param i an hexadecimal value containing the hash value computed with the name of the course
   */
  intToRGB = (i) => {
    var c = (i & 0x00FFFFFF).toString(16).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
  }

  /**
   * Generates a ColorResource object, whose instances are calculated for each course present in the schedule (each course has a color associated to it)
   */
  generateResources = () => {
    let v = [];
    let res = Object.assign({}, ColorResources);
    res.id = 1;
    res.fieldName = "title";
    res.instances = [];

    console.log(titles);
      for (let title of titles) {
        console.log(title);
        let instance = Object.assign({}, Instances);
        instance.id = title.courseName;
        instance.text = "Classroom: " + title.classroom;
        instance.color = '#' + this.intToRGB(this.hashCode(title.courseName));
        res.instances.push(instance);
      }
    v.push(res);
    this.setState({ resources: v });
  }

  /**
   * Renders the calendar that shows to a student all his future booked seats in all lessons.
   * The calendar only shows days from Monday to Friday and hours from 8:00 to 19:30, and can support different levels of viewing information (by single day, by week, by month)
   * 
   * currentViewNameChange is not defined in the code
   * To be removed?
   */
  render() {
    const { currentDate } = this.state.currentDate;
    let schedulerData = [...this.state.schedulerLectures];
    let res = [...this.state.resources];

    return (
      <AuthContext.Consumer>
      {(context) => (
      <React.Fragment>

        <Paper>
          <Scheduler data={schedulerData} height={660} >
            <ViewState currentDate={currentDate} onCurrentDateChange={this.currentDateChange} onCurrentViewNameChange={this.currentViewNameChange} />
            <WeekView 
              startDayHour={"8:00"}
              endDayHour={"19:30"}
              excludedDays={[0, 6]}
              timeTableCellComponent={TimeTableCell}
              dayScaleCellComponent={DayScaleCell}
            />
            <DayView startDayHour={"8:00"} endDayHour={"19:30"} />
            <MonthView />
            <Appointments />
            <Resources data={res} />
            <AppointmentTooltip showCloseButton />
            <AppointmentForm readOnly />
            <Toolbar />
            <ViewSwitcher />
            <DateNavigator />
            <TodayButton />
          </Scheduler>
        </Paper>
      </React.Fragment>
      )}
      </AuthContext.Consumer>
    );
  }
}

export default LessonsCalendar;
