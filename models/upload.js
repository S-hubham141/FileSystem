const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/upload',{useNewUrlParser: true});
var conn = mongoose.Collection;
//Create Schema and Model

var uploadSchema = new Schema({
    filename: String,
    fileSize: Number,
    fileType: String,
    file: String,
});

var uploadModel = mongoose.model('uploadfiles',uploadSchema); 

module.exports = uploadModel;