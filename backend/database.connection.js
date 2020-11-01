//initialization
require('dotenv').config();
const port = process.env.PORT;
const db_url = process.env.DB_URL;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(db_url, { useNewUrlParser: true }).then(() => {
    console.log("Connected to MongoDB successfully :)");
}).catch((e) => {
    console.log("Error while attempting to connect to MongoDB");
    console.log(e);
});

// To prevent deprectation warnings (from MongoDB native driver)
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


module.exports = {
    mongoose
};