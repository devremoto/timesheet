const express = require('express');
const bodyParser = require('body-parser');
var load = require('express-load');
const expressValidator = require('express-validator');
const cors = require('cors');
//const swaggerRouter = require('../routes/routes/swagger.route');
const urlPrefix = '';
const consts = require('./config');
module.exports = (function() {
    const app = express();
    const http = require('http').Server(app);

    let name = 'timesheet';
    const io = require('socket.io')(http);
    app.set('io', io);
    app.get('io').on('connection', socket => {
        socket.on('list', result => {
        });
    });
    app.use((req, res, next) => {
        req.io = io;
        next();
    });

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(expressValidator());
    //app.use(`${app.urlPrefix}`, swaggerRouter);
    load('routes', { cwd: 'app' }).into(app);

    app.use((req, res, next) => {
        res.status(404).send({ code: 404 });
        next();
    });

    app.use((error, req, res, next) => {
        if (process.env.NODE_ENV === 'production') {
            res.status(500).send({ code: 500 });
            return;
        }
        console.log(error);
        next(error);
    });

    app.urlPrefix = urlPrefix;

    app.start = () => {
        let port = process.env.PORT || consts.PORT;
        http.listen(port, () => {
            console.clear();
            console.log(`
================================================================================================
================================================================================================

Server running on
http://localhost:${port}

GET
curl http://localhost:${port}${urlPrefix}/${name}s

Swagger Document
http://localhost:${port}${urlPrefix}/swagger

================================================================================================
================================================================================================
`);
        });
    };

    return app;
})();
