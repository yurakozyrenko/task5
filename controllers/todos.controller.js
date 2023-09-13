const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient('mongodb+srv://yurikozyrenko:N1357=Dt@cluster0.6xqtrex.mongodb.net/ToDo?retryWrites=true&w=majority');
const ObjectId = require('mongodb').ObjectId;

const startDb = require('../utils/db');
startDb();

class ToDosControllers {
    async getToDos(user) {
        const connection = await mongoClient.connect();
        const db = await connection.db('ToDo');
        const toDos = await db.collection('ToDos').aggregate().toArray();

        const toDo = toDos.filter((item) => item.idUser === user.id);

        connection.close();
        return toDo;
    }

    async createToDo(toDo, user) {
        const connection = await mongoClient.connect();
        const db = await connection.db('ToDo');
        const toDos = await db.collection('ToDos').aggregate().toArray();

        toDo.isCompleted = false;
        toDo.idUser = user.id;
        toDos.push(toDo);

        await db.collection('ToDos').insertOne(toDo);

        connection.close();
        return toDo;
    }

    async patchToDo(newTitle, id, user) {
        const connection = await mongoClient.connect();
        const db = await connection.db('ToDo');
        const toDos = await db.collection('ToDos').aggregate().toArray();

        const toDo = toDos.filter((item) => item.idUser === user.id);
        if (toDo.length === 0) {
            throw new Error('no task for user');
        }

        const foundToDo = toDo.filter(
            (item) =>
                JSON.stringify(item._id) === JSON.stringify(new ObjectId(id))
        );

        if (foundToDo.length === 0) {
            throw new Error('no find title task');
        }

        await db
            .collection('ToDos')
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: { title: newTitle.title } }
            );

        connection.close();
        return foundToDo;
    }

    async deleteToDo(id, user) {
        const connection = await mongoClient.connect();
        const db = await connection.db('ToDo');
        const toDos = await db.collection('ToDos').aggregate().toArray();

        const toDo = toDos.filter((item) => item.idUser === user.id);
        if (toDo.length === 0) {
            throw new Error('no task for user');
        }

        const foundToDo = toDo.filter(
            (item) =>
                JSON.stringify(item._id) === JSON.stringify(new ObjectId(id))
        );

        if (foundToDo.length === 0) {
            throw new Error('false');
        }

        await db.collection('ToDos').deleteOne({ _id: new ObjectId(id) });

        connection.close();
        return true;
    }

    async patchToDoStatus(id, user) {
        const connection = await mongoClient.connect();
        const db = await connection.db('ToDo');
        const toDos = await db.collection('ToDos').aggregate().toArray();

        const toDo = toDos.filter((item) => item.idUser === user.id);
        if (toDo.length === 0) {
            throw new Error('no task for user');
        }

        const foundToDo = toDo.filter(
            (item) =>
                JSON.stringify(item._id) === JSON.stringify(new ObjectId(id))
        );

        if (foundToDo.length === 0) {
            throw new Error('no find title task');
        }

        await db
            .collection('ToDos')
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: { isCompleted: !foundToDo[0].isCompleted } }
            );

        connection.close();
        return foundToDo;
    }
}

module.exports = new ToDosControllers();
