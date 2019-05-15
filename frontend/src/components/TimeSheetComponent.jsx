import React, { Component } from 'react';
import moment from 'moment'
import TimesheetDays from './TimeSheetDays';
import TimeSheetService from '../services/timesheet';
import Month from '../models/month';
import Day from '../models/day';
import TimeSheet from '../models/timesheet';
const formats = ['HH:mm', 'HH:mm:ss']


export default class TimeSheetComponent extends Component {

    constructor(props) {
        super(props);
        var timesheet = new TimeSheet();
        timesheet.format = formats[0];
        this.state = { now: new moment(), timesheet, format: formats[0] };
        this.service = new TimeSheetService();

    }
    componentDidMount() {
        this.setData();
    }

    toogleFormat = () => {
        var { timesheet } = this.state;
        timesheet.format = (timesheet.format === formats[0]) ? formats[1] : formats[0];
        this.setState({ timesheet })
    }  

    lastDayOfMonth(month) {
        var year = new moment().year();
        var leapYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
        const months = [31, (leapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return months[month - 1];
    };

    setData() {
        var { timesheet, now } = this.state;
        this.service.getByMonth(5).then(result => {
            //timesheet.months = result.months
            timesheet.months.push(new Month(result.months[0]))
            console.log(timesheet);
            for (let i = 1; i <= this.lastDayOfMonth(timesheet.months[0].number); i++) {
                console.log(timesheet.months[0].days[i-1].number*1);
                    var day = timesheet.months[0].days.findIndex(x => x.number == i)
                    if (day) {
                        timesheet.months[0].days[i] =new Day(i);
                        timesheet.months[0].days[i].hours = day.hours;
                        //obj.hours = day.hours.map(x => moment.utc(x));
                    }else{
                        timesheet.months[0].days.push(new Day(i));
                    }                
            }

            this.setState({ timesheet });
        });
    }

    render() {

        var { timesheet } = this.state;
        return (

            <div className="table-responsive">
                <button className="btn btn-sm  btn-primary" onClick={this.toogleFormat}>toogle format {timesheet.format}</button><br /><br />
                <table className="table table-striped table-sm">
                    <thead>
                        <tr >
                            <th style={{ textAlign: 'center', width: '4%' }}>#</th>
                            <th style={{ textAlign: 'center', width: '23%' }}>Entrada Manhã</th>
                            <th style={{ textAlign: 'center', width: '23%' }}>Saída Manhã</th>
                            <th style={{ textAlign: 'center', width: '23%' }}>Entrada Tarde</th>
                            <th style={{ textAlign: 'center', width: '23%' }}>Saída Tarde</th>
                            <th style={{ textAlign: 'right', width: '4%' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TimesheetDays timesheet={timesheet}></TimesheetDays>
                    </tbody>
                </table>
            </div>
        );
    }
}
