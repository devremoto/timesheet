const JL = require('jsnlog').JL;
const model = require('./../models/timesheet');
const service =  require('../services/crud')(model);

module.exports = {
    list: (req, res) => {
        service
            .list()
            .then(result => {
                req.io.emit('list', result);
                JL('controller:list').info(result);
                //console.log(req.io);
                req.io.on('list', result => {
                    console.log(
                        '=================io funcionando=================\n'
                    );
                    console.log(result);
                });
                res.send(result);
            })
            .catch(error => {
                JL('controller:list:error').error(error);
                res.status(500).send({ error });
            });
    },

    getByName: (req, res) => {
        const name = req.params.name;
        service
            .getByName(name)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                JL('controller').error(
                    `error calling repository: ${JSON.stringify(error)}`
                );
                res.status(500).send({ error: `${JSON.stringify(error)}` });
            });
    },

    create: (req, res) => {
        service
            .create(req.body, req.io)
            .then(result => {
                JL('controller').info(
                    `feature created sucessfully: ${JSON.stringify(result)}`
                );
                res.status(201).send(result);
            })
            .catch(error => {
                JL('controller').error(
                    `error calling repository: ${JSON.stringify(error)}`
                );
                res.status(500).send({ error: `${JSON.stringify(error)}` });
            });
    },

    update: (req, res) => {
        service
            .update(req.body, req.io)
            .then(result => {
                JL('controller').info(
                    `feature updated sucessfully: ${JSON.stringify(result)}`
                );
                res.send(result);
            })
            .catch(error => {
                JL('controller').error(
                    `error calling repository: ${JSON.stringify(error)}`
                );
                res.status(500).send({ error: `${JSON.stringify(error)}` });
            });
    },

    delete: (req, res) => {
        service
            .delete(req.params.id, req.io)
            .then(result => {
                JL('delete').info({ id: req.params.id, result });
                res.send(result);
            })
            .catch(error => {
                JL().error(error);
                res.status(500).send({ error });
            });
    }
};
