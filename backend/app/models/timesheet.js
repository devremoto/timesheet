const mongoose = require("mongoose");
const userSchema = require('./user');

const day = mongoose.model('day', {
    number:Number,
    hours: []
});

const month = mongoose.model('month', {
    name: String,
    number: Number,
    days: [day.schema]
});

const schema = mongoose.model('timesheet', {
    user: userSchema.schema,
    months: [month.schema]
}, 'timesheet');

module.exports = schema