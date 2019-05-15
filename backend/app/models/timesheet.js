const mongoose = require("mongoose");
const { month } = require("./month");
const userSchema = require('./user');

const schema = mongoose.model('timesheet', {
    user: userSchema.schema,
    months: [month.schema]
}, 'timesheet');

module.exports = schema