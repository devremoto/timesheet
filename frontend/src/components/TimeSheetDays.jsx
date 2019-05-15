import React, { Component } from 'react'
import moment from 'moment';
import TimeSheetService from '../services/timesheet';

export default class TimeSheetDays extends Component {
    constructor(props) {
        super(props)
        this.state = { now: new moment(), month: props.timesheet.months[0], format: props.timesheet.format }
        this.service = new TimeSheetService();
        this.setNow();
    }

    total = new moment();

    setNow() {
        this.setState({ now: new moment() })
        var $this = this;
        setTimeout(() => {
            $this.setNow()
        }, 1000)
    }

    setHour = (day, hour) => {
        var { month } = this.state;
        console.log(month);
        var index = month.days.findIndex(x => x.id === day.id);
        month.days[index].hours.push(hour)
        this.setState({ month });
        this.service.setHour(month).then(
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

        var { format } = this.state;
        var now = new moment();
        return [0, 1, 2, 3].map(x => (
            <td key={x} style={{ textAlign: 'center' }}>
                {this.getPeriod(day, x) ? (<button onClick={() => { this.setHour(day, now) }} className="btn btn-sm  btn-danger">{now.format(format)}</button>) : (day && day.hours[x]) ? day.hours[x].format(format) : ""}
            </td>))
    }

    rowTotal() {
        var { month } = this.state;
        return (
            <tr>
                <td style={{ textAlign: 'center' }}></td>
                <td colSpan="4"></td>
                <td style={{ textAlign: 'right' }}>{month.total}-{month.totalFormated}-{month.amount(70)}</td>
            </tr>)
    }

    render() {
        var { month, format } = this.state;
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

        return (
            <React.Fragment>
                {this.rowTotal()}
                {rows}
                {this.rowTotal()}
            </React.Fragment>
        )
    }
}