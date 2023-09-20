const ToDo = require('../models/todo');
const ToDosService = require('../services/todos.service');

const { validationResult } = require('express-validator');

class ToDosControllers {
    async getToDos(req, res) {
        try {
            const toDos = await ToDosService.getAllToDos(req.user);
            return res.status(200).send(toDos);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    async createToDo(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            req.body.isCompleted = false;
            req.body.idUser = req.user.id;

            const newToDo = await ToDosService.createToDo(req.body);
            return res.status(200).send(newToDo);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    async patchToDo(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const updateToDo = await ToDosService.updateToDoTitle(
                req.body,
                req.params.id,
                req.user
            );

            if (!updateToDo) {
                throw new Error('У пользователя нет task c указанным id');
            }

            return res.status(200).send(updateToDo);
        } catch (error) {
            return res.status(400).send(error.message);
        }
    }

    async deleteToDo(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const result = await ToDosService.deleteToDo(
                req.params.id,
                req.user
            );

            if (!result) {
                return res.send(false);
            }
            return res.status(200).send(true);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    async patchToDoStatus(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const findToDo = await ToDosService.getOneToDo(
                req.params.id,
                req.user
            );

            if (findToDo) {
                const newValue = !findToDo.isCompleted;

                const updateToDo = await ToDosService.updateToDoStatus(
                    newValue,
                    req.params.id,
                    req.user
                );

                return res.status(200).send(updateToDo);
            } else {
                throw new Error('У пользователя нет task c указанным id');
            }
        } catch (error) {
            return res.status(400).send(error.message);
        }
    }
}

module.exports = new ToDosControllers();
