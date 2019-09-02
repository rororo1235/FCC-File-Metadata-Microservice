'use strict';

var express = require('express');
var cors = require('cors');
var router = express.Router();
var formidable = require('formidable')

// require and use "multer"...

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

router.post('/api/fileanalyse', (req, res, next) => {
  new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
      console.log('Field', name, field)
    })
    .on('file', (name, file) => {
      if (file == null || file.name == "") return next({message : 'Please upload a file!'});
      res.json({
        name : file.name,
        type : file.type,
        size : file.size,
        lastModified: file.lastModifiedDate
      });  
    })
    .on('aborted', () => {
      return next({message : 'Request aborted by the user'});
    })
    .on('error', (err) => {
      return next({message : err});
    })
})


app.use("/", router);

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error handler
app.use(function(err, req, res, next) {
  if(err) {
    if(err.message){
      res.status(500).json({
        error : err.message
      });
    } else
    res.status(500)
      .type('txt')
      .send('SERVER ERROR');
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
