const mongoose = require('mongoose');
const consts = require('../config/config');
var DB_URL = process.env.DB_URL || consts.DB_URL;

module.exports = {
    createConnection: () => {
        return new Promise((resolve, reject) => {
            let objConn = {}
            mongoose.connect(
                DB_URL,
                { useNewUrlParser: true },
                (error) => {
                    if (error) {
                        return reject(objConn);
                    } else {
                        return resolve(objConn)
                    }

                }
            );
        })
    },
    add: (model, data) => {
        return new Promise((resolve, reject) => {
            if (data instanceof Array) {
                model.insertMany(data).then(docs => {
                    resolve(docs)
                }).catch(error => {
                    reject(error);
                })
            } else {
                new model(data).save().then(docs => {
                    resolve(docs)
                }).catch(error => {
                    reject(error);
                })
            }
        })
    },
    update: (model, data) => {
        return new Promise((resolve, reject) => {

            model.findOneAndUpdate({ _id: data._id }, data).then(docs => {
                resolve(data)
            }).catch(error => {
                reject(error);
            })
        })
    },
    delete: (model, id) => {
        return new Promise((resolve, reject) => {

            model.findOneAndDelete({ _id: id }).then(docs => {
                resolve(docs)
            }).catch(error => {
                reject(error);
            })
        })
    },
    getAll: (model) => {
        return new Promise((resolve, reject) => {
            model.find({})
                .then(docs => {
                    resolve(docs)
                }).catch(error => {
                    reject(error);

                })
        })
    },
    find: (data) => {
        return new Promise((resolve, reject) => {

            data.model.find(data.query).then(docs => {
                resolve(docs)
            }).catch(error => {
                reject(error);
            })
        })
    }
}
