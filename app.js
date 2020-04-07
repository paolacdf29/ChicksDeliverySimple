var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret : 'CURSOPWI_2019', 
  resave: false,
  saveUninitialized: true,
  cookie : {maxAge : null}
}))

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const step1Router = require('./routes/step1');
const addproductRouter = require('./routes/addproduct');
const step2Router = require('./routes/step2');
const step3Router = require('./routes/step3');
const step4Router = require('./routes/step4');
const registroRouter = require('./routes/registro');
const loginRouter = require('./routes/login');
const startRouter = require('./routes/start');
const paneladminRouter = require('./routes/paneladmin');
const kitchenRouter = require('./routes/kitchen');
const userconfRouter = require('./routes/userconf');
const orderRouter = require('./routes/order');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/step1', step1Router);
app.use('/addproduct', addproductRouter);
app.use('/step2', step2Router);
app.use('/step3', step3Router);
app.use('/step4', step4Router);
app.use('/registro', registroRouter);
app.use('/login', loginRouter);
app.use('/start', startRouter);
app.use('/paneladmin', paneladminRouter);
app.use('/kitchen', kitchenRouter);
app.use('/userconf', userconfRouter);
app.use('/order', orderRouter);



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

module.exports = app;
