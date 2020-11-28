import React from 'react';
import Paper from '@material-ui/core/Paper';
import moment from 'moment'
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
} from '@devexpress/dx-react-scheduler-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import API from '../api/API';
import Schedule from '../api/schedule'

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

const Appointment = ({children, style, ...restProps}) => (
  <Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      //backgroundColor: corso, 
      borderRadius: '8px',
    }}
  >
    {children}
  </Appointments.Appointment>
);

class LessonsCalendar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentDate: moment(),
      bookings: [],
      lectures: [],
      schedulerLectures: [],
    };
  }

  componentDidMount() {
    this.currentDateChange = (currentDate) => { this.setState({ currentDate }); };
    API.getBookings(this.props.studentId).then((bookings) => this.setState({ bookings: bookings }, () => this.findDates()));
  }

  findCourseName = (courseId) => {
    let course = this.props.courses.find((c) => c.courseId == courseId);
    return course.name;
  }

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

        bschedule.title = this.findCourseName(lectures.courseId);
        bschedule.startDate = start;
        bschedule.endDate = end;

        schedulerData_.push(bschedule);
        this.setState({ schedulerLectures: schedulerData_ })
      })
    }
  }

  render() {
    const { currentDate } = this.state.currentDate;
    let schedulerData = [...this.state.schedulerLectures]

    /*function hashCode(str) { // java String#hashCode
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
         hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    } 
  
    function intToRGB(i){
      var c = (i & 0x00FFFFFF).toString(16).toUpperCase();
  
      return "00000".substring(0, 6 - c.length) + c;
    }
    */
    //for (let a of this.state.schedulerLectures){ 
      //corso = '#' + intToRGB(hashCode(a.title))
    //}
    //
    return (
      <Paper>
        <Scheduler data={schedulerData} height={660}>
          <ViewState currentDate={currentDate} onCurrentDateChange={this.currentDateChange} onCurrentViewNameChange={this.currentViewNameChange} />
          <WeekView
            startDayHour={"8:00"}
            endDayHour={"19:30"}
            excludedDays={[0, 6]}
            timeTableCellComponent={TimeTableCell}
            dayScaleCellComponent={DayScaleCell}
          />
          <DayView
            startDayHour={"8:00"}
            endDayHour={"19:30"}
            excludedDays={[0, 6]}
            timeTableCellComponent={TimeTableCell}
            dayScaleCellComponent={DayScaleCell}
          />
          <MonthView />
          <Appointments appointmentComponent={Appointment}/>
          <AppointmentTooltip showCloseButton/>
          <AppointmentForm readOnly/>
          <Toolbar />
          <ViewSwitcher />
          <DateNavigator />
          <TodayButton />
        </Scheduler>
      </Paper>
    );
  }
}

export default LessonsCalendar;
