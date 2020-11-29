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
  Resources,
} from '@devexpress/dx-react-scheduler-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import API from '../api/API';
import Schedule from '../api/schedule'
import ColorResources from '../api/colorResources';
import Instances from '../api/instances'

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
        let courseName = this.findCourseName(lectures.courseId)
        titles.push(courseName);

        bschedule.title = courseName;
        bschedule.startDate = start;
        bschedule.endDate = end;

        schedulerData_.push(bschedule);
        this.setState({ schedulerLectures: schedulerData_ }, () => this.generateResources())
      })
    }
  }

  hashCode = (str) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) 
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return hash;
  } 

  intToRGB = (i) => {
    var c = (i & 0x00FFFFFF).toString(16).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
  }

  generateResources = () => {
    let v = [];
    let res = Object.assign({}, ColorResources);
    res.id = 1;
    res.fieldName = "title";
    res.instances = [];
    

    for(let title of titles){
      let instance = Object.assign({}, Instances);
      instance.id = title;
      instance.color = '#' + this.intToRGB(this.hashCode(title));
      res.instances.push(instance);
    }
    v.push(res);
    this.setState({resources: v});
  }

  render() {
    const { currentDate } = this.state.currentDate;
    let schedulerData = [...this.state.schedulerLectures];
    let res = [...this.state.resources];

    return (
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
          <DayView startDayHour={"8:00"} endDayHour={"19:30"}/>
          <MonthView />
          <Appointments/>
          <Resources data={res}/> 
          <AppointmentTooltip showCloseButton/>
          <AppointmentForm readOnly/>
          <Toolbar />
          <ViewSwitcher />
          <DateNavigator />
          <TodayButton />
        </Scheduler>
      </Paper>
      </React.Fragment>
    );
  }
}

export default LessonsCalendar;
