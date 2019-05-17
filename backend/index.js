const app = require('./app/config/express');
const consts = require('./app/config/config');
const connection = require('./app/infra/mongo-connection');

connection
    .createConnection()
    .then(success => console.log(success))
    .catch(error => console.log(error));

app.start();
