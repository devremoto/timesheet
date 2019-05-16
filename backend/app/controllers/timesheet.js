const JL = require('jsnlog').JL;
const model = require('./../models/timesheet');
const service = require('../services/crud')(model);

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

    getByMonth: (req, res) => {
        const number = req.params.number;
        service
            .findOne({ "months.number": number }, { months: { $elemMatch: { number: number } } })
            .then(result => {
                if (result && result.months)
                    res.send(result);
                else
                    res.status(404).send()
            }
            )
            .catch(error => {
                JL('controller').error(
                    `error calling service: ${JSON.stringify(error)}`
                );
                res.status(500).send({ error: `${JSON.stringify(req.params)}` });
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

    path: (req, res) => {

        var payload = req.body;
        var path = {
            _id: payload._id,
            'months.days': { $elemMatch: { _id: { $eq: payload.day._id } } },
            
        }
    var action = { $push: { hours: payload.day.hour }}
        service
            .path(path, action, req.io)
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
