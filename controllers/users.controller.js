const { validationResult } = require('express-validator');
const UsersService = require('../services/users.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

class UserControllers {
    async createUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password } = req.body;
            const user = await UsersService.getUser({ email: email });
            if (user) {
                throw new Error('Логин уже используется');
            }
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const createdUser = await UsersService.createUser({
                email,
                password: hashedPassword,
            });
            return res.status(200).send(createdUser);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    async loginUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password } = req.body;

            const findUser = await UsersService.getUser({ email: email });
            if (!findUser) {
                throw new Error('Пользователь не зарегистрирован');
            }

            const compareUser = await bcrypt.compare(
                password,
                findUser.password
            );
            if (!compareUser) {
                throw new Error('invalid password');
            }
            const token = jwt.sign(
                { idUser: findUser._id },
                process.env.ACCESS_TOKEN_SECRET
            );

            return res.status(200).send({ token });
        } catch (error) {
            return res.status(401).send(error.message);
        }
    }
}
module.exports = new UserControllers();
