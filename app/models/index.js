const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

// MODELS DATABASE IMPORTS
db.link = require('./link')(mongoose);

module.exports = db;