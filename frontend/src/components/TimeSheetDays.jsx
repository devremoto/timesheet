import React, { Component } from 'react'
import moment from 'moment';
import TimeSheetService from '../services/timesheet';
import TimeSheet from '../models/timesheet';
import Month from '../models/month';
import Day from '../models/day';

const formats = ['HH:mm', 'HH:mm:ss']

export default class TimeSheetDays extends Component {
    constructor(props) {
        super(props)
        var timesheet = new TimeSheet()
        timesheet.format = formats[0];
        this.state = { now: new moment(), timesheet }
        this.service = new TimeSheetService();
        this.setNow = this.setNow.bind(this);


    }

    toogleFormat = () => {
        var { timesheet } = this.state;
        var format = (timesheet.format === formats[0]) ? formats[1] : formats[0];
        timesheet.format = format;
        timesheet.month.format = format;
        this.setState({ timesheet })
    }

    lastDayOfMonth(month) {
        var year = new moment().year();
        var leapYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
        const months = [31, (leapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return months[month - 1];
    };

    setData() {
        var { timesheet } = this.state;
        this.service.getByMonth(new Date().getMonth() + 1).then(result => {
            timesheet._id=result._id
            timesheet.month = new Month(result.months[0])
            for (let i = timesheet.month.days.length + 1; i <= this.lastDayOfMonth(timesheet.month.number); i++) {
                timesheet.month.days.push(new Day(i));
            }
            this.setState({ timesheet });
        });
    }

    componentDidMount() {
        this.setData();
        this.setNow();
    }

    setNow() {
        this.setState({ now: new moment() })
        //var $this = this;
        setTimeout(() => {
            this.setNow()
        }, 1000)
    }

    setHour = (day, hour) => {
        console.log(day);
        var { timesheet } = this.state;
        //this.setState({ month });
        this.service.setHour({_id:timesheet._id,day:{_id:day._id,hour}}).then(
            success => console.log(success),
            error => console.log(error)
        )
    }

    getPeriod = (day, period) => {
        var now = new moment();
        if (day.id !== now.date())
            return false;

        return day.hours.length === period
    }

    renderCell = (day) => {
        var { timesheet} = this.state;
        var now = new moment();
        return [0, 1, 2, 3].map(x => (
            <td key={x} style={{ textAlign: 'center' }}>
                {this.getPeriod(day, x) ? (<button onClick={() => { this.setHour(day, now) }} className="btn btn-sm  btn-danger">{now.format(timesheet.format)}</button>) : (day && day.hours[x]) ? day.hours[x].format(timesheet.format) : ""}
            </td>))
    }

    getTotal() {
        var { timesheet } = this.state;
        var month = timesheet.month;
        return month && month.total ? month.totalFormated : '';
    }

    rowTotal() {
        return (
            <tr>
                <td style={{ textAlign: 'center' }}></td>
                <td colSpan="4"></td>
                <td style={{ textAlign: 'right' }}>{this.getTotal()}</td>
            </tr>)
    }

    rows() {
        var { timesheet } = this.state;
        var month = timesheet.month;
        var format = timesheet.format;
        console.log(format)
        var renderCell = this.renderCell;
        var rows;
        if (month && month.days)
            rows = month.days.map(function (day, i) {
                return (
                    <tr key={i} >
                        <td style={{ textAlign: 'center' }}>{day.id}</td>
                        {renderCell(day)}
                        <td style={{ textAlign: 'right' }}>{(day && day.total) ? day.total.format(format) : ' '}</td>
                    </tr>

                );
            })
        return rows
    }

    render() {
        var { format } = this.state;
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
                        {this.rowTotal()}
                        {this.rows()}
                        {this.rowTotal()}
                    </tbody>
                </table>
            </div>
        )
    }
}