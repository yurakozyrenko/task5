const express = require('express');
const router = express.Router();
const ToDosControllers = require('../controllers/todos.controller');
const verifyJWT = require('../middleware/verifyJWT');
const { param, body, validationResult } = require('express-validator');

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

router.get('/', verifyJWT, async (req, res) => {
    try {
        const toDos = await ToDosControllers.getToDos(req.user);
        res.send(toDos);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

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

router.post(
    '/',
    verifyJWT,
    body('title').notEmpty().withMessage('Title должно быть строкой'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const toDo = await ToDosControllers.createToDo(req.body, req.user);
            res.send(toDo);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }
);

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
    param('id')
        .isLength({ min: 24, max: 24 })
        .withMessage(
            'Укажите корректный id (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)'
        ),
    body('title')
        .exists({ checkFalsy: true })
        .withMessage('Title должно быть строкой'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const toDo = await ToDosControllers.patchToDo(
                req.body,
                req.params.id,
                req.user
            );
            res.send(toDo);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }
);

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

router.delete(
    '/:id',
    verifyJWT,
    param('id')
        .isLength({ min: 24, max: 24 })
        .withMessage(
            'Укажите корректный id (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)'
        ),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const toDo = await ToDosControllers.deleteToDo(
                req.params.id,
                req.user
            );
            res.send(toDo);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }
);

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
    param('id')
        .isLength({ min: 24, max: 24 })
        .withMessage(
            'Укажите корректный id (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)'
        ),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const toDo = await ToDosControllers.patchToDoStatus(
                req.params.id,
                req.user
            );
            res.send(toDo);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }
);

module.exports = router;
