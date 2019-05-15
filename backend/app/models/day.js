const mongoose = require("mongoose");
const day = mongoose.model('day', {
    number: Number,
    hours: []
});
exports.day = day;
