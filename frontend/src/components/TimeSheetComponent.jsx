import React, { Component } from 'react';
import moment from 'moment'
const formats = ['HH:mm', 'HH:mm:ss']

class Day {
    id;
    start;
    lunchTime;
    lunchReturn;
    end;

    get total() {
        var result = null;
        if (this.start && this.lunchTime) {
            result = this.lunchTime.diff(this.start);
        }
        if (this.lunchReturn && this.end) {
            result = this.end.diff(this.lunchReturn) + this.lunchTime.diff(this.start)
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

        if (!day.start)
            return 1 === period

        if (!day.lunchTime)
            return 2 === period

        if (!day.lunchReturn)
            return 3 === period

        if (!day.end)
            return 4 === period
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
        var { now, days } = this.state;
        for (let i = 1; i <= this.lastDayOfMonth(now.month()); i++) {

            //var date = new Date(now.getFullYear(), now.getMonth(), i, now.getHours(), now.getMinutes(), now.getSeconds());

            days.push(new Day(i));

            this.setState({ days });

        }

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

        var { days, now, format } = this.state;
        var hourFormated = now.format(format)
        var getPeriod = this.getPeriod;
        var $this = this;
        return (

            <div className="table-responsive">
                <button className="btn btn-sm  btn-primary" onClick={this.toogleFormat}>toogle format {format}</button><br /><br />
                <table className="table table-striped table-sm">
                    <thead>
                        <tr >
                            <th style={{textAlign: 'center',width:'10%'}}>#</th>
                            <th style={{textAlign: 'center',width:'18%'}}>Entrada Manhã</th>
                            <th style={{textAlign: 'center',width:'18%'}}>Saída Manhã</th>
                            <th style={{textAlign: 'center',width:'18%'}}>Entrada Tarde</th>
                            <th style={{textAlign: 'center',width:'18%'}}>Saída Tarde</th>
                            <th style={{textAlign: 'center',width:'18%'}}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            days.map(function (day, i) {
                                return (
                                    <tr key="{i}" >
                                        <td style={{textAlign: 'center',width:'10%'}}>{day.id}</td>
                                        <td style={{textAlign: 'center',width:'18%'}}>{getPeriod(day, 1) ? (<button onClick={() => { $this.setHour(day, 1) }} className="btn btn-sm  btn-danger">{hourFormated}</button>) : (day && day.start) ? day.start.format(format) : " "}</td>
                                        <td style={{textAlign: 'center',width:'18%'}}>{getPeriod(day, 2) ? (<button onClick={() => { $this.setHour(day, 2) }} className="btn btn-sm  btn-warning">{hourFormated}</button>) : (day && day.lunchTime) ? day.lunchTime.format(format) : ' '}</td>
                                        <td style={{textAlign: 'center',width:'18%'}}>{getPeriod(day, 3) ? (<button onClick={() => { $this.setHour(day, 3) }} className="btn btn-sm  btn-info">{hourFormated}</button>) : (day && day.lunchReturn) ? day.lunchReturn.format(format) : ' '}</td>
                                        <td style={{textAlign: 'center',width:'18%'}}>{getPeriod(day, 4) ? (<button onClick={() => { $this.setHour(day, 4) }} className="btn btn-sm  btn-success">{hourFormated}</button>) : (day && day.end) ? day.end.format(format) : ' '}</td>
                                        <td style={{textAlign: 'center',width:'18%'}}>{(day && day.total) ? day.total.format(format) : ' '}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                {/* /*<!-- asdasd  -->sdfsdsdfsdf*/}
            </div>
        );
    }
}
