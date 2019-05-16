import moment from 'moment'
export default class Day {
    id;
    _id;
    hours = [];
    get total(){
        var result = null
        if (this.hours && this.hours.length > 1){
            result = this.hours.reduce((previous, current) => current.diff(previous));
        }

        if (result != null) {
            return moment.utc(result)
        }
        return null
    }

    constructor(i, day) {
        this.id = i;
        if (day) {
            
            this.transform(day)
        }
    }

    transform(day) {
        this._id = day._id;
        this.number = day.number;
        this.hours = day.hours.map(x => moment.utc(x));        
    }
}