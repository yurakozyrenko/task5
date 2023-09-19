const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const toDoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
    },
    idUser: {
        type: String,
    },
});

const ToDo = mongoose.model('ToDo', toDoSchema);

module.exports = ToDo;
