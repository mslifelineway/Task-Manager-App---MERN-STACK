//initialization
const mongoose = require('mongoose');

//schema
const TaskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    _listId: {
        type: String,
        required: true,
        trim: true,
    },
    completed : {
        type: Boolean,
        default: false,
    }

});

//creating model of schema
mongoose.model('Tasks', TaskSchema);

//exporting model to use later
module.exports = mongoose.model('Tasks', TaskSchema);