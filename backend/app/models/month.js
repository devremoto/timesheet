const mongoose = require("mongoose");
const { day } = require("./day");
const month = mongoose.model('month', {
    name: String,
    number: Number,
    days: [day.schema]
});
exports.month = month;
