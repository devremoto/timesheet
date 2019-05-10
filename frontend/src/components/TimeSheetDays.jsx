import React, { Component } from 'react'

export default class TimeSheetDays extends Component {
    constructor(props) {
        super(props)
        this.props = props
    }
    render() {
        var days = this.props.days;
        days.map(function (day, i) {
            return (
                <tr key={i} >
                    <td style={{ textAlign: 'center', width: '10%' }}>{day.id}</td>
                    {() => {
                        var result;
                        for (var x = 0; x < 4; x++) {
                            if (day.hours.length > x) {
                                result += (
                                    <React.Fragment>
                                        <td style={{ textAlign: 'center', width: '18%' }}>
                                            {getPeriod(day.hours, x + 1) ? (<button onClick={() => { $this.setHour(day, 1) }} className="btn btn-sm  btn-danger">{hourFormated}</button>) : (day && day.hours[x]) ? day.hours[x].format(format) : " "}
                                        </td>
                                    </React.Fragment>
                                )
                            } else {
                                result += (<td>nãotem</td>)
                            }
                        }
                        return result;
                    }
                    }
                    <td style={{ textAlign: 'center', width: '18%' }}>{(day && day.total) ? day.total.format(format) : ' '}</td>
                </tr>
            );
        })
    }
}