var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');;
var session = require('express-session');
var passport = require('passport');
var flash =  require('connect-flash');
var validator = require('express-validator');
var csrf = require('csurf');
var indexRouter = require('./routes/index');
var usersWebRouter = require('./routes/userweb');
var usersRouter = require('./routes/users');
var productRoutes = require('./routes/product');
var categoryRoutes = require('./routes/category');
var testexcel = require('./routes/testExcel');
var app = express();



require('./config/passport');

// view engine setup

app.engine('.hbs',expressHbs({defaultLayout: 'layout',extname: '.hbs'}));
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({secret: 'mysupersecret',resave: false,saveUninitialized: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));



app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','*');
//     res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     if(req.method==='OPTIONS'){
//         res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json({});
//     }
//     next();
// })





app.use('/user', usersWebRouter);
app.use('/', indexRouter);

app.use('/uploads',express.static('uploads'));
app.use('/imageUser',express.static('imageUser'));
app.use(require('./controllers/authController'));
app.use('/product',productRoutes);
app.use('/category',categoryRoutes);
app.use('/users', usersRouter);
app.use('/excel',testexcel);



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
