const ToDosService = require('../services/todos.service');

const { validationResult } = require('express-validator');

class ToDosControllers {
    async getToDos(req, res) {
        try {
            const { idUser } = req.user;
            const toDos = await ToDosService.getAllToDos(idUser);
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

            const { idUser } = req.user;
            const { title, isCompleted } = req.body;

            const newToDo = await ToDosService.createToDo({
                idUser,
                title,
                isCompleted,
            });
            console.log(newToDo.email);
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
            const { idUser } = req.user;
            const { title } = req.body;
            const { id } = req.params;

            const updateToDo = await ToDosService.updateToDoTitle(
                title,
                id,
                idUser
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

            const { idUser } = req.user;
            const { id } = req.params;
            const result = await ToDosService.deleteToDo(id, idUser);

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

            const { idUser } = req.user;
            const { id } = req.params;

            const findToDo = await ToDosService.getOneToDo(id, idUser);

            if (findToDo) {
                const newValue = !findToDo.isCompleted;

                const updateToDo = await ToDosService.updateToDoStatus(
                    newValue,
                    id,
                    idUser
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
