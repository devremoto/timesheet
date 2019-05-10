const express = require('express');
const router = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

module.exports = function(app) {
    var swaggerDefinition = {
        info: {
            title: 'Arquivo NODE JS Microservice',
            version: '1.0.0',
            description: 'Arquivo'
        },
        basePath: app.urlPrefix
    };

    // options for the swagger docs
    var options = {
        // import swaggerDefinitions
        swaggerDefinition: swaggerDefinition,
        // path to the API docs
        apis: ['**/routes/*', 'index.js'] // pass all in array
    };

    // initialize swagger-jsdoc
    var swaggerSpec = swaggerJSDoc(options);

    app.use(`/swagger`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get(`/swagger.json`, function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
};
