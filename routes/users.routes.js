const express = require('express');
const router = express.Router();
const UsersControllers = require('../controllers/users.controller');
const { checkSchema } = require('express-validator');
const { registerSchema } = require('../helpers');

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
 *                application/json:
 *                  schema:
 *                    type: object
 *                    required:
 *                      - token
 *                    properties:
 *                      token:
 *                        type: string
 *                        example: i132nro2iu3br2u3bro2i3ro233nfwdfwef434f34f34f3
 *          401:
 *              description: Проблемы с аутентификацией или авторизацией
 *          500:
 *              description: Some server err
 */
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

router.post('/login', checkSchema(registerSchema), UsersControllers.loginUser);

router.post(
    '/register',
    checkSchema(registerSchema),
    UsersControllers.createUser
);

module.exports = router;
