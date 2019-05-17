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
                req.io.on('list', result => {
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
            .findOne(
                { 'months.number': number },
                { months: { $elemMatch: { number: number } } }
            )
            .then(result => {
                if (result && result.months) {
                    res.send(result);
                }
                else {
                    service.create({ user: {}, months: [{ number }] }).then(
                        result => res.send(result)
                    )
                    res.status(404).send();
                }
            })
            .catch(error => {
                JL('controller').error(
                    `error calling service: ${JSON.stringify(error)}`
                );
                res.status(500).send({
                    error: `${JSON.stringify(req.params)}`
                });
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
        var { _id, month } = req.body;
        var path = {
            _id: _id,
            months: { number: month.number, days: { $elemMatch: { _id: month.day._id } } }
        };
        service.findOne(path).then(result => {
            if (result) {
                var action = {
                    $push: { 'months.days.$.hours': month.day.hour }
                };
            } else {
                path = {
                    _id: _id,
                    months: {
                        $elemMatch: {
                            number: month.number
                        }
                    }
                };
                var action = {
                    $set: {
                        'months.$.days': [{
                            number: month.day.number,
                            hours: [month.day.hour]
                        }]
                    }
                };
            }
            service.findOne(path).then(result => {
                var space = "\n\n=========================\n\n"
                console.log(space, result, space, path, space, action, space);
            });
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
