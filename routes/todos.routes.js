const express = require('express');
const router = express.Router();
const ToDosControllers = require('../controllers/todos.controller');
const verifyJWT = require('../middleware/verifyJWT');
const { checkSchema} = require('express-validator');

const { idSchema, titleSchema } = require('../helpers');

/**
 * @swagger
 * /api/todos:
 *  get:
 *      security:
 *      - bearerAuth: []
 *      summary: Get all todos
 *      tags: [Todos]
 *      description: Returns tasks array
 *      responses:
 *          200:
 *              description: Success response
 *              content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                      $ref: "#/components/schemas/ToDoItem"
 *          401:
 *              description: Unauthorized Error
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - message
 *                    properties:
 *                      message:
 *                        type: string
 *                        example: Для работы нужен токен
 *          404:
 *              description: The users by age was not found
 *          500:
 *              description: Some server err
 */

router.get('/', verifyJWT, ToDosControllers.getToDos);

/**
 * @swagger
 * /api/todos:
 *  post:
 *      security:
 *      - bearerAuth: []
 *      summary: Create a new todo for current user and return Todos object
 *      tags: [Todos]
 *      description: Create a new todo for current user and return Todos object.
 *      requestBody:
 *          required: true
 *          description: Title for new todo.
 *          content:
 *              application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - title
 *                    properties:
 *                      title:
 *                        type: string
 *                        example: Купить хлеб
 *      responses:
 *          200:
 *              description: Success response
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: "#/components/schemas/ToDoItem"
 *          400:
 *              description: Bad request
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - success
 *                      - errors
 *                    properties:
 *                      success:
 *                        type: string
 *                        example: false
 *                      errors:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            msg:
 *                              type: string
 *                              example: Title должно быть строкой
 *                            param:
 *                              type: string
 *                              example: title
 *                            location:
 *                              type: string
 *                              example: body
 *          401:
 *              description: Unauthorized Error
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - message
 *                    properties:
 *                      message:
 *                        type: string
 *                        example: Для работы нужен токен
 *          500:
 *              description: Some server err
 */

router.post('/', verifyJWT, checkSchema(titleSchema), ToDosControllers.createToDo)

/**
 * @swagger
 * /api/todos/{id}:
 *  patch:
 *      security:
 *      - bearerAuth: []
 *      summary: Update ToDO title with Id
 *      tags: [Todos]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Set an {id} of a todo to update
 *      requestBody:
 *          required: true
 *          description: Title for new todo.
 *          content:
 *              application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - title
 *                    properties:
 *                      title:
 *                        type: string
 *                        example: купить хлеб
 *      responses:
 *          200:
 *              description: Success response
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: "#/components/schemas/ToDoItem"
 *          400:
 *              description: Bad request
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - success
 *                      - errors
 *                    properties:
 *                      success:
 *                        type: string
 *                        example: false
 *                      errors:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            msg:
 *                              type: string
 *                              example: Title должно быть строкой
 *                            param:
 *                              type: string
 *                              example: title
 *                            location:
 *                              type: string
 *                              example: body
 *          401:
 *              description: Unauthorized Error
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - message
 *                    properties:
 *                      message:
 *                        type: string
 *                        example: Для работы нужен токен
 *          500:
 *              description: Some server err
 */

router.patch(
    '/:id',
    verifyJWT,
    checkSchema(idSchema),
    checkSchema(titleSchema),
    ToDosControllers.patchToDo)


/**
 * @swagger
 * /api/todos/{id}:
 *  delete:
 *      security:
 *      - bearerAuth: []
 *      summary: Delete ToDO with Id
 *      tags: [Todos]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Set an {id} of a todo to update
 *      responses:
 *          200:
 *              description: Success response
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: "#/components/schemas/ToDoItem"
 *          400:
 *              description: Bad request
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - message
 *                    properties:
 *                      message:
 *                        type: string
 *                        example: У пользователя нет такой задачи
 *          401:
 *              description: Unauthorized Error
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - message
 *                    properties:
 *                      message:
 *                        type: string
 *                        example: Для работы нужен токен
 *          500:
 *              description: Some server err
 */

router.delete('/:id', verifyJWT, checkSchema(idSchema),ToDosControllers.deleteToDo)

/**
 * @swagger
 * /api/todos/{id}/isCompleted:
 *  patch:
 *      security:
 *      - bearerAuth: []
 *      summary: Update isCompleted property
 *      tags: [Todos]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Set an {id} of a todo to update
 *      responses:
 *          200:
 *              description: Success response
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: "#/components/schemas/ToDoItem"
 *          400:
 *              description: Bad request
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - message
 *                    properties:
 *                      message:
 *                        type: string
 *                        example: У пользователя нет такой задачи
 *          401:
 *              description: Unauthorized Error
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - message
 *                    properties:
 *                      message:
 *                        type: string
 *                        example: Для работы нужен токен
 *          500:
 *              description: Some server err
 */

router.patch(
    '/:id/isCompleted',
    verifyJWT,
    checkSchema(idSchema),
    ToDosControllers.patchToDoStatus)

module.exports = router;
