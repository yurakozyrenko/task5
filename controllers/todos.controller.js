const ToDo = require('../models/todo');
const { validationResult } = require('express-validator');

class ToDosControllers {
    async getToDos(req, res) {
        try {
            const toDos = await ToDo.find({ idUser: req.user.id });
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

            const newToDo = new ToDo(req.body);
            newToDo.save();

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
            const updateToDo = await ToDo.findByIdAndUpdate(
                { _id: req.params.id, idUser: req.user.id },
                { $set: { title: req.body.title } },
                { returnDocument: 'after' }
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
            const result = await ToDo.findByIdAndDelete({
                _id: req.params.id,
                idUser: req.user.id,
            });

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

            const findToDo = await ToDo.findById({
                _id: req.params.id,
                idUser: req.user.id,
            });

            if (findToDo) {
                const newValue = !findToDo.isCompleted;

                const updateToDo = await ToDo.findByIdAndUpdate(
                    {
                        _id: req.params.id,
                        idUser: req.user.id,
                    },
                    { $set: { isCompleted: newValue } },
                    { returnDocument: 'after' }
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
