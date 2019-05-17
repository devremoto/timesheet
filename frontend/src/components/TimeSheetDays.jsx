import moment from 'moment';
import React, { Component } from 'react';

import Day from '../models/day';
import Month from '../models/month';
import TimeSheet from '../models/timesheet';
import TimeSheetService from '../services/timesheet';

const formats = ['HH:mm', 'HH:mm:ss'];

export default class TimeSheetDays extends Component {
    constructor(props) {
        super(props);
        var timesheet = new TimeSheet();
        timesheet.format = formats[0];
        this.state = { now: new moment(), timesheet };
        this.service = new TimeSheetService();
        this.setNow = this.setNow.bind(this);
    }

    toogleFormat = () => {
        var { timesheet } = this.state;
        var format = timesheet.format === formats[0] ? formats[1] : formats[0];
        timesheet.format = format;
        timesheet.month.format = format;
        this.setState({ timesheet });
    };

    lastDayOfMonth(month) {
        var year = new moment().year();
        var leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        const months = [
            31,
            leapYear ? 29 : 28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
        ];
        return months[month - 1];
    }

    setData() {
        var { timesheet } = this.state;
        timesheet.month = new Month();
        timesheet.month.number = new Date().getMonth() + 1;
        console.log(timesheet);
        for (let i = 1; i <= this.lastDayOfMonth(new Date().getMonth() + 1); i++) {
            timesheet.month.days.push(new Day(i));
        }
        this.service.getByMonth(new Date().getMonth() + 1).then(result => {
            var month = new Month(result.months[0]);
            timesheet._id = result._id;
            for (let i = 1; i <= this.lastDayOfMonth(timesheet.month.number); i++) {
                var day = month.days.find(x => x.number === i);
                if (day) {
                    timesheet.month.days[day.number - 1] = day;
                }
            }
            this.setState({ timesheet });
        });
    }

    componentDidMount() {
        this.setData();
        this.setNow();
    }

    setNow() {
        this.setState({ now: new moment() });
        //var $this = this;
        setTimeout(() => {
            this.setNow();
        }, 1000);
    }

    setHour = (entry) => {
        console.log(entry);
        var { timesheet } = this.state;
        this.setState({ timesheet });
        this.service
            .setHour(entry)
            .then(success => console.log(success), error => console.log(error));
    };

    getPeriod = (day, period) => {
        var now = new moment();
        if (day.number !== now.date()) return false;

        return day.hours.length === period;
    };

    renderCell = day => {
        var { timesheet } = this.state;
        var hour = new moment();
        return [0, 1, 2, 3].map(x => (
            <td key={x} style={{ textAlign: 'center' }}>
                {this.getPeriod(day, x) ? (
                    <button
                        onClick={() => {
                            console.log(timesheet)
                            this.setHour({
                                _id: timesheet._id,
                                month: {
                                    _id: timesheet.month._id,
                                    number: timesheet.month.number,
                                    day: {
                                        _id: day._id,
                                        hour,
                                        number: day.number
                                    }
                                }
                            });
                        }}
                        className="btn btn-sm  btn-danger"
                    >
                        {hour.format(timesheet.format)}
                    </button>
                ) : day && day.hours[x] ? (
                    day.hours[x].format(timesheet.format)
                ) : (
                            ''
                        )}
            </td>
        ));
    };

    getTotal() {
        var { timesheet } = this.state;
        var month = timesheet.month;
        return month && month.total ? month.totalFormated : '';
    }

    rowTotal() {
        return (
            <tr>
                <td style={{ textAlign: 'center' }} />
                <td colSpan="4" />
                <td style={{ textAlign: 'right' }}>{this.getTotal()}</td>
            </tr>
        );
    }

    rows() {
        var { timesheet } = this.state;
        var month = timesheet.month;
        var format = timesheet.format;
        console.log(format);
        var renderCell = this.renderCell;
        var rows;
        if (month && month.days)
            rows = month.days.map(function (day, i) {
                return (
                    <tr key={i}>
                        <td style={{ textAlign: 'center' }}>{day.number}</td>
                        {renderCell(day)}
                        <td style={{ textAlign: 'right' }}>
                            {day && day.total ? day.total.format(format) : ' '}
                        </td>
                    </tr>
                );
            });
        return rows;
    }

    render() {
        var { format } = this.state;
        return (
            <div className="table-responsive">
                <button
                    className="btn btn-sm  btn-primary"
                    onClick={this.toogleFormat}
                >
                    toogle format {format}
                </button>
                <br />
                <br />
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', width: '4%' }}>
                                #
                            </th>
                            <th style={{ textAlign: 'center', width: '23%' }}>
                                Entrada Manhã
                            </th>
                            <th style={{ textAlign: 'center', width: '23%' }}>
                                Saída Manhã
                            </th>
                            <th style={{ textAlign: 'center', width: '23%' }}>
                                Entrada Tarde
                            </th>
                            <th style={{ textAlign: 'center', width: '23%' }}>
                                Saída Tarde
                            </th>
                            <th style={{ textAlign: 'right', width: '4%' }}>
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.rowTotal()}
                        {this.rows()}
                        {this.rowTotal()}
                    </tbody>
                </table>
            </div>
        );
    }
}
