var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
const session = require('express-session');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var index = require('./routes/index');
var student = require('./routes/student');
var subject = require('./routes/subject');
var user = require('./routes/user');

app.use(session({
  secret: '56!@#$!#2346234626!@#$!!@#$',
  resave: false,
  saveUnitialized: true,
  cookies: {}
}))

app.use('/', index);
app.use('/students', student);
app.use('/subjects', subject);
app.use('/users', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
