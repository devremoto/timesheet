class Month {
    constructor(month) {
        this.days = month && month.days || [];
        this.number = month && month.number || new Date().getMonth()+1;
        this.format = 'HH:mm';
    }
    days;
    number;
    format;
    _total;
    get total(){
        var hours = 0;
        var minutes = 0;
        var seconds = 0;
        this.days.map(x => {
            if (x.total) {
                var dateParts = x.total.format(this.format).split(':');
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
        return time < 10 ? `0${time}` : time;
    };
    amount = (value = 0) =>{
        return value * this._total;
    }
}

export default Month 
