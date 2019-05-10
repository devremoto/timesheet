const controller = require('../controllers/timesheet');
module.exports = function(app) {
    /**
     * @swagger
     * definition:
     *   timesheet:
     *     properties:
     *       id:
     *         type: integer
     *       name:
     *         type: string
     *       content:
     *         type: string
     *       params:
     *         type: array
     *         items:
     *           type: object
     *       tags:
     *         type: array
     *         items:
     *           type: object
     *       children:
     *         type: array
     *         items:
     *             $ref: '#/definitions/timesheet'
     */
    var name = '/timesheets';

    /**
     * @swagger
     * /timesheets:
     *   get:
     *     tags:
     *       - timesheets
     *     description: Returns all timesheet
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: An array of timesheet
     *         schema:
     *           $ref: '#/definitions/timesheet'
     *       500:
     *         description: Internal server error
     */
    app.get(name + '', controller.list);

    /**
     * @swagger
     * /timesheets/{name}:
     *   get:
     *     tags:
     *       - timesheets
     *     description: Returns all timesheets
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: name
     *         description: name of json timesheet
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Returns a list of timesheet
     *         schema:
     *           $ref: '#/definitions/timesheet'
     *       404:
     *         description: Id {id} not found
     *       500:
     *         description: Internal server error
     */
    app.get(name + '/:name', controller.getByName);

    /**
     * @swagger
     * /timesheets:
     *   post:
     *     tags:
     *       - timesheets
     *     description: Creates a new timesheet
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: timesheet
     *         description: timesheet object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/timesheet'
     *     responses:
     *       201:
     *         description: timesheet created
     *         schema:
     *           $ref: '#/definitions/timesheet'
     *       500:
     *         description: Error while creating timesheet
     */
    app.post(name + '/', controller.create);

    /**
     * @swagger
     * /timesheets:
     *   put:
     *     tags:
     *       - timesheets
     *     description: Upadates an object of timesheet
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: timesheet
     *         description: timesheet object
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/timesheet'
     *     responses:
     *       200:
     *         description: timesheet updated
     *         schema:
     *           $ref: '#/definitions/timesheet'
     *       500:
     *         description: Error while updateing timesheet
     */
    app.put(name + '/', controller.update);

    /**
     * @swagger
     * /timesheets/{id}:
     *   delete:
     *     tags:
     *       - timesheets
     *     description: Removes one object of timesheet
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: timesheet's id
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: timesheet removed
     *       404:
     *         description: Id {id} not found
     *       500:
     *         description: Internal server error
     */
    app.delete(name + '/:id', controller.delete);
};
