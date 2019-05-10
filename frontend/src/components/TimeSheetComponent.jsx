import React, { Component } from 'react';
import moment from 'moment'
import TimesheetDays from './TimeSheetDays';
const formats = ['HH:mm', 'HH:mm:ss']

class Day {
    id;
    hours = [];
    get total() {
        var result = null;
        if (this.hours.length > 1) {
            result = this.hours[0].diff(this.hours[1]);
        }
        if (this.hours.length > 3) {
            result = this.hours[3].diff(this.hours[2]) + this.hours[0].diff(this.hours[1]);
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
        // Don't call this.setState() here!
        this.state = { now: new moment(), days: [], format: formats[0] };
        this.setHour = this.setHour.bind(this);

    }
    componentDidMount() {
        this.setData();
    }

    toogleFormat = () => {
        var { format } = this.state;
        format = (format === formats[0]) ? formats[1] : formats[0];
        this.setState({ format })
    }

    getPeriod = (day, period) => {
        var { now } = this.state;
        //console.log(day)
        if (day.id !== now.date())
            return false;

        return day.length===period
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
        var { days } = this.state;
        fetch('http://localhost:5001/timesheets')
            .then(result => result.json()
                .then(teste => {
                    var month = teste[0].months[0];

                    for (let i = 1; i <= this.lastDayOfMonth(month.number); i++) {
                        var obj = new Day(i);
                        var day = month.days.find(x => x.number == i);
                        if (day) {
                            obj.hours = day.hours.map(x=>moment.utc(x));
                        }
                        days.push(obj);
                    }
                    this.setState({ days });
                }));
        this.setNow();
    }

    setNow() {
        this.setState({ now: new moment() })
        var $this = this;
        setTimeout(() => {
            $this.setNow()
        }, 1000)
    }


    render() {

        var { days, format } = this.state;
        return (

            <div className="table-responsive">
                <button className="btn btn-sm  btn-primary" onClick={this.toogleFormat}>toogle format {format}</button><br /><br />
                <table className="table table-striped table-sm">
                    <thead>
                        <tr >
                            <th style={{ textAlign: 'center', width: '10%' }}>#</th>
                            <th style={{ textAlign: 'center', width: '18%' }}>Entrada Manhã</th>
                            <th style={{ textAlign: 'center', width: '18%' }}>Saída Manhã</th>
                            <th style={{ textAlign: 'center', width: '18%' }}>Entrada Tarde</th>
                            <th style={{ textAlign: 'center', width: '18%' }}>Saída Tarde</th>
                            <th style={{ textAlign: 'center', width: '18%' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TimesheetDays days={days}></TimesheetDays>
                    </tbody>
                </table>
                {/* /*<!-- asdasd  -->sdfsdsdfsdf*/}
            </div>
        );
    }
}
