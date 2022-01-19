const express = require("express");
const path = require('path');
var mongoose = require("mongoose");
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
require("./models/InventoryItem");
require("dotenv").config();
const cors = require("cors");

var routes = require("./routes/inventoryItemRoutes");

const PORT = process.env.PORT || 3001;

const app = express();

// Mongoose instance connection url connection
mongoose.Promise = global.Promise;
var mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true });
var db = mongoose.connection;
var gfs;
db.on('error', console.error.bind('console', 'CONNECTION ERROR'));
db.once('open', function () {
    gfs = Grid(db);
    console.log("Connected");
})

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/inventoryItems/', routes);

// All other GET requests not handled before will return our React app
app.use('/static', express.static(path.resolve(__dirname, '../client/build/static')))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

module.exports = app;