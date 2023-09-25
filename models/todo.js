const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toDoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },

    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
});

const ToDo = mongoose.model('todos', toDoSchema);

module.exports = ToDo;
