const controller = require('../controllers/user');
module.exports = function(app) {
    /**
     * @swagger
     * definition:
     *   user:
     *     properties:
     *       name:
     *         type: string
     *       content:
     *         email: string
     */
    var name = '/users';

    /**
     * @swagger
     * /users:
     *   get:
     *     tags:
     *       - users
     *     description: Returns all user
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: An array of user
     *         schema:
     *           $ref: '#/definitions/user'
     *       500:
     *         description: Internal server error
     */
    app.get(name + '', controller.list);

    /**
     * @swagger
     * /users/{name}:
     *   get:
     *     tags:
     *       - users
     *     description: Returns all users
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: name
     *         description: name of json user
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Returns a list of user
     *         schema:
     *           $ref: '#/definitions/user'
     *       404:
     *         description: Name {name} not found
     *       500:
     *         description: Internal server error
     */
    app.get(name + '/:name', controller.getByName);

    /**
     * @swagger
     * /users:
     *   post:
     *     tags:
     *       - users
     *     description: Creates a new user
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: user
     *         description: user object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/user'
     *     responses:
     *       201:
     *         description: user created
     *         schema:
     *           $ref: '#/definitions/user'
     *       500:
     *         description: Error while creating user
     */
    app.post(name + '/', controller.create);

    /**
     * @swagger
     * /users:
     *   put:
     *     tags:
     *       - users
     *     description: Upadates an object of user
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: user
     *         description: user object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/user'
     *     responses:
     *       200:
     *         description: user updated
     *         schema:
     *           $ref: '#/definitions/user'
     *       500:
     *         description: Error while updateing user
     */
    app.put(name + '/', controller.update);

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     tags:
     *       - users
     *     description: Removes one object of user
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: user's id
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: user removed
     *       404:
     *         description: Id {id} not found
     *       500:
     *         description: Internal server error
     */
    app.delete(name + '/:id', controller.delete);
};
