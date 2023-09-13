const express = require('express');
const router = express.Router();
const usersRoutes = require('./users.routes');
const toDosRoutes = require('./todos.routes');

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            description: email
 *          password:
 *            type: string
 *            description: password
 *        example:
 *            email: example@example.com
 *            password: CatCat
 */

/**
 * @swagger
 *  components:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *    schemas:
 *      ToDoItem:
 *        type: object
 *        required:
 *          - title
 *          - isCompleted
 *          - id
 *        properties:
 *          id:
 *            type: string
 *            description: id
 *          title:
 *            type: string
 *            description: title
 *          isCompleted:
 *            type: boolean
 *            description: isCompleted
 *        example:
 *            title: Купить хлеб
 *            isCompleted: false
 *            id: 1111111111111   
 */

router.use('/users', usersRoutes);
router.use('/todos', toDosRoutes);

module.exports = router;
