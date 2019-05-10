const app = require('./app/config/express');
const consts = require('./app/config/config');
const connection = require('./app/infra/mongo-connection');

connection.createConnection();

app.start();
