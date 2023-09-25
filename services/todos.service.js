const ToDo = require('../models/todo');

class ToDosService {
    async getAllToDos(idUser) {
        const toDos = await ToDo.find({ idUser: idUser }).exec();
        return toDos;
    }

    async getOneToDo(id, idUser) {
        const toDo = await ToDo.findById({ _id: id, idUser: idUser });
        return toDo;
    }

    async createToDo(todo) {
        const newToDo = new ToDo(todo);
        newToDo.save();
        return newToDo;
    }

    async updateToDoTitle(newTitle, id, idUser) {
        const updateToDo = await ToDo.findOneAndUpdate(
            { _id: id, idUser: idUser },
            { $set: { title: newTitle } },
            { returnDocument: 'after' }
        );
        return updateToDo;
    }

    async deleteToDo(id, idUser) {
        const updateToDo = await ToDo.findByIdAndDelete({
            _id: id,
            idUser: idUser,
        });
        return updateToDo;
    }

    async updateToDoStatus(newStatus, id, idUser) {
        const updateToDo = await ToDo.findOneAndUpdate(
            { _id: id, idUser: idUser },
            { $set: { isCompleted: newStatus } },
            { returnDocument: 'after' }
        );
        return updateToDo;
    }
}
module.exports = new ToDosService();
