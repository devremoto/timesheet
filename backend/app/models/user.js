const mongoose = require("mongoose");

const schema = mongoose.model('user', {
    email:String,
    name: String,
},'user')
module.exports = schema