const ToDo = require('../models/todo');



class ToDosService {
    async getAllToDos(user) {
        const toDos = await ToDo.find({idUser: user.id});
        return toDos;
    }

    async getOneToDo(id,user){
        const toDo = await ToDo.findById({_id: id, idUser: user.id});
        return toDo;
    }

    async createToDo(todo) {
        const newToDo = new ToDo(todo);
        newToDo.save();
        return newToDo;
    }

    async updateToDoTitle(newTitle, id, user) {
        const updateToDo = await ToDo.findOneAndUpdate(
            { _id: id, idUser: user.id },
            { $set: { title: newTitle.title } },
            { returnDocument: 'after' }
        );
        return updateToDo;
    }

    async deleteToDo(id, user) {
        const updateToDo = await ToDo.findByIdAndDelete({
            _id: id,
            idUser: user.id,
        });
        return updateToDo;
    }

    async updateToDoStatus(newStatus, id, user) {
        const updateToDo = await ToDo.findOneAndUpdate(
            { _id: id, idUser: user.id },
            { $set: { isCompleted: newStatus } },
            { returnDocument: 'after' }
        );
        return updateToDo;
    }
}
module.exports = new ToDosService();
