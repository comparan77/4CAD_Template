var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


//UPload files
var multer = require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});


app.post('/asn/upcsv',function(req,res){

  var upload = multer({ storage : storage}).single('file_detail_product');

  upload(req,res,function(err) {

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
  }
  else if (!req.file) {
      return res.send('Please select an image to upload' + req.file);
  }
  else if (err instanceof multer.MulterError) {
      return res.send(err);
  }
  else if (err) {
      return res.send(err);
  }

      if(err) {
          return res.end("Error uploading file." + JSON.stringify(err));
      }
      res.end("File is uploaded" + JSON.stringify(req.file));
  });
});

// socket
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(function(req, res, next){
  res.io = io;
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Bootstrap 4 y librerías necesarias
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// io.on('connection', (socket)=> {
//   // socket.emit('rec_cortina', request('http://localhost:3002/asn_rec_cortina', (error, response, body) => {
//   //   return JSON.parse(body);
//   // }));
//   console.log('a user connected');
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
