const mongoose = require("mongoose");
const userSchema = require('./user');

const schema = mongoose.model('timesheet', {
    user:userSchema.schema,
    months:[]
},'timesheet')
module.exports = schema