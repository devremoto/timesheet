const JL = require('jsnlog').JL;
const crudRepository = require('../infra/repositories/crud');

module.exports = function (model) {
    const repository = crudRepository(model);
    return {


        list: () => {
            return repository.getAll();
        },

        find: (query, fields) => {
            return repository.find({ query }, fields);
        },
        findOne: (query, fields) => {
            return repository.findOne({ query }, fields)
        },

        getByName: name => {
            return new Promise((resolve, reject) => {
                repository
                    .find({ query: { name } })
                    .then(result => {
                        if (result.length == 1) {
                            resolve(result[0]);
                        } else if (result.length <= 0) {
                            reject(`The data is not found`);
                        } else {
                            reject(
                                `Found ${result.length} data with (${name})`
                            );
                        }
                    },
                        error => reject(error)
                    )
                    .catch(error => reject(error))
            });
        },

        create: (entity, socketIo) => {
            return new Promise((resolve, reject) => {
                if (entity) {
                    repository
                        .find({ query: { name: entity.name } })
                        .then(result => {
                            if (result.length == 0) {
                                repository
                                    .add(entity, socketIo)
                                    .then(result => resolve(result), error => reject(error))
                                    .catch(err => {
                                        JL('mongo-service:create').error(err);
                                        reject(err);
                                    });
                            } else {
                                reject(
                                    `"data alread exist" ${JSON.stringify(
                                        result.name
                                    )}`
                                );
                            }
                        });
                } else {
                    reject('data not send in request');
                }
            });
        },

        update: (entity, socketIo) => {
            console.log(entity);
            return new Promise((resolve, reject) => {
                repository
                    .update(entity, socketIo)
                    .then(result => resolve(result), error => reject(error))
                    .catch(error => {
                        JL('mongo-service:update error').error(error);
                        reject(error);
                    });
            })
        },

        delete: (id, socketIo) => {
            return new Promise((resolve, reject) => {
                repository.find({ query: { _id: id } })
                    .then(entity => {
                        if (entity) {
                            repository
                                .delete(id, socketIo)
                                .then(
                                    result => resolve(result),
                                    error => reject(error)
                                );
                        } else {
                            reject(`Can not delete the Id ${id} not found`);
                        }
                    },
                        error => reject(error))
                    .catch(error => reject(error));
            });
        }
    }
};
