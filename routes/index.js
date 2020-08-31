var express = require('express');
var router = express.Router();
var multer = require('multer');
const mongoose = require('mongoose');
const assert = require('assert');
var ejs = require('ejs');
var uploadModel = require('../models/upload');
var path = require('path');
var fileData = uploadModel.find({});
//static folder
router.use(express.static(__dirname+"./public/"));
//ES6 Promises
mongoose.Promise = global.Promise ;

//Using multer to get data/files
var Storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function(req,file,cb){
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});
//middleware for image/file upload
var upload = multer({ 
  storage:Storage 
}).single('files');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'File System'
  });
});
router.get('/uploads', function(req, res, next){
  fileData.exec(function(err, data){
    if(err) throw err;
    res.render('output', {
      title: 'File System',
      records:data
    });
  });
});

//handling Post request
router.post('/uploads',upload, function(req, res ,next){
  var fileinfo = req.file.originalname;
  var fileSize = req.file.size;
  var fileType = req.file.mimetype;
  var file = req.file.filename ;
  
  var uploadDetails = new uploadModel({
    filename: fileinfo,
    fileSize: fileSize,
    fileType: fileType,
    file: file
  });
  //saving to db
  uploadDetails.save(function(err, doc){
    if(err) throw err;
    fileData.exec(function(err, data){
      if(err) throw err;
      res.render('output', {
        title: 'File System',
        records:data
      });
    });
  });
});  

router.get('/uploads/:id',function (req, res, next) {
  var id = req.params.id;
  
  fileData.exec(function(err, data){
    if(err) throw err;
    if(data.file !== id){
      res.send('<h3>No Files with this name added.</h3>');
    } else {
      res.send('<img src="./uploads/<%= row.id %>" alt="Image File" width="80" />')
    }
    /*res.render('eachFile', {
      title: 'File System',
      records:data,
      id: id
    });*/
  });
});  

module.exports = router;
