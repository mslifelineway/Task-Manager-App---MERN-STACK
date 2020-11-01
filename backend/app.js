//initialization
require('dotenv').config();//must keep on top to use environment variables
const express = require("express");
const app = express();

const port = process.env.PORT;
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const { mongoose } = require('./database.connection');//must include to connect the database
const listController = require('./controllers/list.controller');
const taskController = require('./controllers/task.controller');
const userController = require('./controllers/user.controller');


/** MIDDLEWARE */
app.use(morgan('dev'));
// app.use(cors());
app.use(bodyParser.json());
// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

/** MIDDLEWARE - END */

//controller mapping
app.use('/lists', listController);
//task operations with specified list (required : listId on taskController)
app.use('/list', taskController);
app.use('/tasks', taskController);
app.use('/users', userController);
//accept all the urls
// app.all('**', (req, res) => {
//     res.json({
//         status: true,
//         message: 'Location not found!',
//     });
// });





//start the server
app.listen(port, function(){
    console.log("Server running on port " + port);
});