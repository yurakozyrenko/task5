const express = require('express');
const router = express.Router();
const UsersControllers = require('../controllers/users.controller');
const { body, validationResult } = require('express-validator');

/**
 * @swagger
 * /api/users/login:
 *  post:
 *      summary: Check user in system
 *      tags: [Login]
 *      requestBody:
 *          required: true
 *          description: Check email and password
 *          content:
 *              application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - email
 *                      - password
 *                    properties:
 *                      email:
 *                        type: string
 *                        example: example@example.com
 *                      password:
 *                        type: string
 *                        example: CatCat
 *      responses:
 *          200:
 *              description: The user was successfully register
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          401:
 *              description: Проблемы с аутентификацией или авторизацией
 *          500:
 *              description: Some server err
 */

router.post('/login',
body('email').isEmail().withMessage('Укажите корректный email (example@example.com)'),
body('password').isLength({ min: 6 }).withMessage('Пароль должен быть длиной не менее 6 символов'),
async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const token = await UsersControllers.loginUser(req.body);
        res.send({ token });
    } catch (error) {
        return res.status(401).send(error.message);
    }
});

/**
 * @swagger
 * /api/users/register:
 *  post:
 *      summary: Register a new user
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          description: Register a new user
 *          content:
 *              application/json:
 *                  schema:
 *                     $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: The user was successfully register
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          500:
 *              description: Some server err
 */

router.post(
    '/register',
    body('email').isEmail().withMessage('Укажите корректный email (example@example.com)'),
    body('password').isLength({ min: 6 }).withMessage('Пароль должен быть длиной не менее 6 символов'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            await UsersControllers.createUser(req.body);
            res.send('Пользователь зарегистрирован');
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }
);

module.exports = router;
