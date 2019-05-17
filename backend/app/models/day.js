const mongoose = require("mongoose");
const day = mongoose.model('day', {
    number: { type: Number, unique : true, required : true, dropDups: true },
    hours: [{ type: Date, default: Date.now, unique : true,dropDups: true }]
});
exports.day = day;
