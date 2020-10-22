/* 
File name :app.js
Student’s Name: Supriya Kanda
Student ID :301166350
 Date: 09-10-2020
*/




var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookieSession = require('cookie-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// serving the public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/secure', express.static(path.join(__dirname, 'public')));
app.use('/secure/business_contacts/list', express.static(path.join(__dirname, 'public')));
app.use('/secure/business_contacts/edit', express.static(path.join(__dirname, 'public')));

// APPLY COOKIE SESSION MIDDLEWARE
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 3600 * 1000 // 1hr
}));


require('./routes/routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
