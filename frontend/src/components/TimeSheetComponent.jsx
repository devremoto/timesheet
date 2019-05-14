import React, { Component } from 'react';
import moment from 'moment'
import TimesheetDays from './TimeSheetDays';
import TimeSheetService from '../services/timesheet';

const formats = ['HH:mm', 'HH:mm:ss']
export class Month {
    constructor() {
        this.days = [];
        this.format = 'HH:mm';

    }
    days;
    number;
    format;
    _total;

    get total() {
        var hours = 0;
        var minutes = 0;
        var seconds = 0;
        this.days.map(x => {
            if (x.total) {
                var dateParts = x.total.format(this.format).split(':')
                if (dateParts.length === 3) {
                    seconds += dateParts[2] / 3600;
                }
                hours += dateParts[0] * 1;
                minutes += dateParts[1] / 60;
            }
            return null;
        });
        this._total = hours + minutes + seconds;
        return this._total;
    }

    get totalFormated() {
        var hours = parseInt(this._total);
        var minDec = ((this._total - hours) * 60).toFixed(2);
        var minutes = parseInt(minDec);
        var seconds = parseInt((minDec - minutes) * 60);
        if (this.format.split(':').length === 3)
            return `${this.formatNumber(hours)}:${this.formatNumber(minutes)}:${this.formatNumber(seconds)}`;
        return `${this.formatNumber(hours)}:${this.formatNumber(minutes)}`;
    }

    formatNumber = (time) => {
        return time < 10 ? `0${time}` : time
    }    

    amount(value = 0) {
        return value * this._total
    }
}
export class Day {
    id;
    hours = [];
    get total() {
        var result = null
        if (this.hours.length > 1)
            result = this.hours.reduce((previous, current) => current.diff(previous));

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
        this.service = new TimeSheetService();

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
        this.service.getByMonth(month.number).then(result => {
            month.number = (result && result[0].months) ? result[0].months[0].number : now.month();
            for (let i = 1; i <= this.lastDayOfMonth(month.number); i++) {
                var obj = new Day(i);
                if (result && result[0].months) {
                    var day = result[0].months[0].days.find(x => x.number === i);
                    if (day) {
                        obj.hours = day.hours.map(x => moment.utc(x));
                    }
                }
                month.days.push(obj);
            }

            this.setState({ month });
        });
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
            </div>
        );
    }
}
