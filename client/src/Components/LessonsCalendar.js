import React from 'react';
import Paper from '@material-ui/core/Paper';
import moment from 'moment'
import { ViewState } from '@devexpress/dx-react-scheduler';
import {Scheduler,
        WeekView,
        Toolbar,
        DateNavigator,
        Appointments,
        TodayButton, 
        ViewSwitcher, 
        MonthView, 
        DayView,
} from '@devexpress/dx-react-scheduler-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

//npm i --save @devexpress/dx-react-core @devexpress/dx-react-scheduler
//npm i --save @devexpress/dx-react-scheduler-material-ui

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

    if(date.getDate() === new Date().getDate()) 
        return <WeekView.TimeTableCell {...restProps} className={classes.todayCell} />;
  
    if (date.getDay() === 0 || date.getDay() === 6)
        return <WeekView.TimeTableCell {...restProps} className={classes.weekendCell} />;

    return <WeekView.TimeTableCell {...restProps} />;
};

const TimeTableCell = withStyles(style, { name: 'TimeTableCell' })(TimeTableCellBase);

const DayScaleCellBase = ({ classes, ...restProps }) => {
    const { startDate, today } = restProps;
  
    if(today) 
        return <WeekView.DayScaleCell {...restProps} className={classes.today} />;
    
    if(startDate.getDay() === 0 || startDate.getDay() === 6) 
        return <WeekView.DayScaleCell {...restProps} className={classes.weekend} />;
    
    return <WeekView.DayScaleCell {...restProps} />;
};

const DayScaleCell = withStyles(style, { name: 'DayScaleCell' })(DayScaleCellBase);

class LessonsCalendar extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          currentDate: moment(),
        };
        this.currentDateChange = (currentDate) => { this.setState({ currentDate }); };
      }

    render() {

        const { currentDate } = this.state;

        return (
            <Paper>
              <Scheduler height={660}>
               <ViewState currentDate={currentDate} onCurrentDateChange={this.currentDateChange} onCurrentViewNameChange={this.currentViewNameChange}/>
                <WeekView
                  startDayHour={"8:00"}
                  endDayHour={"19:30"}
                  excludedDays={[0, 6]}
                  timeTableCellComponent={TimeTableCell}
                  dayScaleCellComponent={DayScaleCell}
                />
                <MonthView />
                <DayView />
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
