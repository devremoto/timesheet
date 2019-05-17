const app = require('./app/config/express');
const connection = require('./app/infra/mongo-connection');

connection.createConnection()

app.start();
