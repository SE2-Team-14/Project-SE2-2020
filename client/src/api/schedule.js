import { Appointments } from "@devexpress/dx-react-scheduler";

class Schedule extends Appointments{
    constructor(title, startDate, endDate) {
        super()
        //this.id = id;
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

export default Schedule;