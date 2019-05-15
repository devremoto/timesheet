
const model = require('./../models/timesheet');
const crudRepository = require('../infra/repositories/crud');
module.exports = {
     repository:crudRepository(model),
}