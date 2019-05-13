import React, { Component } from 'react'
import moment from 'moment';

export default class TimeSheetDays extends Component {
    constructor(props) {
        super(props)
        this.state={now: new moment()}
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

    getPeriod = (day, period) => {
        var now = new moment();
        if (day.id !== now.date())
            return false;

        return day.hours.length === period
    }

    renderCell = (day) => {

        var { format } = this.props;
        var now = new moment();
        return [0, 1, 2, 3].map(x => (
            <td key={x} style={{ textAlign: 'center' }}>
                {this.getPeriod(day, x) ? (<button onClick={() => { this.setHour(day, 1) }} className="btn btn-sm  btn-danger">{now.format(format)}</button>) : (day && day.hours[x]) ? day.hours[x].format(format) : ""}
            </td>))
    }

    render() {
        var { month, format } = this.props;
        var renderCell = this.renderCell

        var rows
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
                <tr>
                    <td style={{ textAlign: 'center' }}></td>
                    <td colSpan="4"></td>
                    <td style={{ textAlign: 'right' }}>{month.total}</td>
                </tr>
                {rows}
                <tr>
                    <td style={{ textAlign: 'center' }}></td>
                    <td colSpan="4"></td>
                    <td style={{ textAlign: 'right' }}>{month.total}</td>
                </tr>
            </React.Fragment>
        )
    }
}