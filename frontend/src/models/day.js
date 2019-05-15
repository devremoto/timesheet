import moment from 'moment'
export default class Day {
    id;
    hours = [];
    total = () => {
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