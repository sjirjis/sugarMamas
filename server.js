//package requirements
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const dbConfig = require('./config/dbConfig');

//init app
const app = express();

//init mongodb
mongoose.connect(dbConfig.URL);

//get routes
require('./routes/routes.js')(app);

//kill header for privacy
app.disable('x-powered-by');

//view engine
const handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(cookieParser());

//static/public folder
app.use(express.static(__dirname + '/public'));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// app.use(function(req, res) {
//   res.type('text/html');
//   res.status(404);
//   res.render('404');
// });
//
// app.use(function(err, req, res, next) {
//   console.error(err.stack);
//   res.status(500);
//   res.render('500');
// });

//server connection
const PORT = 4000;
app.set('port', process.env.PORT || PORT);
app.listen(app.get('port'), function() {
  console.log('app is listening on port:', PORT);
});
