const { validationResult } = require('express-validator');
const User = require('../models/users');

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

            const users = await User.find({ email: email });
            if (users.length !== 0) {
                throw new Error('Логин уже используется');
            }
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = {
                email,
                password: hashedPassword,
            };

            const newUser = new User(user);
            newUser.save();

            return res.status(200).send(newUser);
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

            const findUser = await User.findOne({ email: email });

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
                { id: findUser._id },
                process.env.ACCESS_TOKEN_SECRET
            );

            return res.status(200).send({ token });
        } catch (error) {
            return res.status(401).send(error.message);
        }
    }
}
module.exports = new UserControllers();
