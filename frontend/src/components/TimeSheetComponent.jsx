import React, { Component } from 'react';
import moment from 'moment'
import TimesheetDays from './TimeSheetDays';

const formats = ['HH:mm', 'HH:mm:ss']
export class Month {
    constructor() {
        this.days = [];
        this.format = 'HH:mm';
    }
    days;
    number;
    format;
    get total() {
        var hours = 0;
        var minutes = 0;
        var seconds = 0;
        var parts = this.format.split(':')
        this.days.map(x => {
            if (x.total) {
                var dateParts = x.total.format(this.format).split(':')
                if (dateParts.length === 3) {
                    seconds += dateParts[2] * 1;
                }
                hours += dateParts[0] * 1;
                minutes += dateParts[1] * 1;
            }

            return null;
        })
        minutes += seconds / 60;
        hours += parseInt(minutes / 60);
        minutes = parseInt(minutes % 60);
        seconds = parseInt(seconds % 60);
        var result = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
        if (parts.length === 3)
            result = `${result}:${seconds < 10 ? `0${seconds}` : seconds}`;
        return result;
    }
}
export class Day {
    id;
    hours = [];
    get total() {
        var result = null;
        if (this.hours.length > 1) {
            result = this.hours[1].diff(this.hours[0]);
        }
        if (this.hours.length > 1) {
            result = this.hours[3].diff(this.hours[2]) + this.hours[1].diff(this.hours[0]);
        }

        if (result != null) {
            return moment.utc(result)
        }
        return null
    }

    constructor(i) {
        this.id = i;
    }


}

export default class TimeSheetComponent extends Component {

    constructor(props) {
        super(props);
        var month = new Month();
        month.format = formats[0];
        this.state = { now: new moment(), month, format: formats[0] };
        this.setHour = this.setHour.bind(this);

    }
    componentDidMount() {
        this.setData();
    }

    toogleFormat = () => {
        var { format, month } = this.state;
        format = (format === formats[0]) ? formats[1] : formats[0];
        month.format = format;
        this.setState({ format, month })
    }


    setHour = (day, period) => {
        var { days } = this.state;
        var day2 = days.find(x => x.id === day.id);
        switch (period) {

            case 2:
                day2.lunchTime = new moment();
                break;
            case 3:
                day2.lunchReturn = new moment();
                break;
            case 4:
                day2.end = new moment();
                break;
            default:
                day2.start = new moment();
                break;
        }
        //days[day.id] = day2;
        this.setState({ days });

        //;
    }

    lastDayOfMonth(month) {
        var year = new moment().year();
        var leapYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
        const months = [31, (leapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return months[month - 1];
    };

    setData() {
        var { month, format, now } = this.state;
        console.log(month);
        month.format = format;
        fetch('http://localhost:5001/timesheets')
            .then(result => result.json()
                .then(teste => {
                    month.number = (teste && teste[0].months) ? teste[0].months[0].number : now.month();
                    for (let i = 1; i <= this.lastDayOfMonth(month.number); i++) {
                        var obj = new Day(i);
                        if (teste && teste[0].months) {
                            var day = teste[0].months[0].days.find(x => x.number === i);
                            if (day) {
                                obj.hours = day.hours.map(x => moment.utc(x));
                            }
                        }
                        month.days.push(obj);
                    }

                    this.setState({ month });
                }));
    }




    render() {

        var { month, format } = this.state;
        return (

            <div className="table-responsive">
                <button className="btn btn-sm  btn-primary" onClick={this.toogleFormat}>toogle format {format}</button><br /><br />
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
                        <TimesheetDays month={month} format={format}></TimesheetDays>
                    </tbody>
                </table>
                {/* /*<!-- asdasd  -->sdfsdsdfsdf*/}
            </div>
        );
    }
}
