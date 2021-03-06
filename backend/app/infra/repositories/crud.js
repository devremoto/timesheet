const connection = require('../mongo-connection');
const EventEmitter = require('events');
const JL = require('jsnlog').JL;
class Emitter extends EventEmitter { }
const emitter = new Emitter();

emitter.on('create', sync);
emitter.on('update', sync);
emitter.on('delete', sync);

function sync(data) {
    connection
        .getAll(model)
        .then(list => {
            data.socketIo.emit('update', list);
        })
        .catch(err => {
        });
}

module.exports = function(model){
    return {
        
        add: (data, socketIo) => {
            var $this = module.exports;
            return new Promise((resolve, reject) => {
                if (data.parent) {
                    data.parent = data.parent._id;
                }
                connection
                    .add(model, data)
                    .then(res => {
                       // $this.emit('create', data, socketIo);
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },

        delete: (id, socketIo) => {
            var $this = module.exports;
            return new Promise((resolve, reject) => {
                connection
                    .delete(model, id)
                    .then(res => {
                        $this.emit('delete', res, socketIo);
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },

        update: (data, socketIo) => {
            var $this = module.exports;
            return new Promise((resolve, reject) => {
                connection
                    .update(model, data)
                    .then(res => {
                        JL('repository').info(
                            `update - OK:${JSON.stringify(data)} ${JSON.stringify(
                                res
                            )}`
                        );
                        $this.emit('update', res, socketIo);
                        resolve(res);
                    })
                    .catch(err => {
                        JL('repository').error(
                            `update - ERROR:${JSON.stringify(
                                data
                            )} ${JSON.stringify(err)}`
                        );
                        reject(err);
                    });
            });
        },

        getAll: () => {
            return new Promise((resolve, reject) => {
                connection
                    .getAll(model)
                    .then(docs => {
                        resolve(docs);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        find: (data,fields) => {
            return connection.find({ model, query: data.query },fields);
        },

        findOne: (data,fields) => {
            return connection.findOne({ model, query: data.query },fields);
        },

        path: (query, action) => {
            return connection
                    .path({model,query,action})
        },
        
        emit: (event, data, socketIo) => {
            emitter.emit(event, { data, socketIo });
        }
    }
};
