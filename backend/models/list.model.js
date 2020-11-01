//initialization
const mongoose = require('mongoose');

//schema
const ListSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

});

//creating model of schema
const listModel = mongoose.model('Lists', ListSchema);

//exporting model to use later
// module.exports = {listModel};

module.exports = mongoose.model('Lists', ListSchema);