//package requirements
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');

//init app
const app = express();

//init mongodb
mongoose.connect('mongod://localhost/sugarmamas');

//open db connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

});

//kill header for privacy
app.disable('x-powered-by');

//view engine
const handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//bodyparsing
app.use(bodyParser.json());
app.use(require('body-parser').urlencoded({
  extended: false
}));
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

//routes
app.get('/', function(req, res) {
  res.render('home');
});

app.get('/oldHome', function(req, res) {
  res.render('oldHome');
})

app.post('/register', function(req, res) {
  if (req.body.username &&
    req.body.email &&
    req.body.zipCode &&
    req.body.password &&
    req.body.confirmPassword &&
    (req.body.password == req.body.confirmPassword)) {
    var userData = {
      username: req.body.username,
      email: req.body.email,
      zipCode: req.body.zipCode,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function(err, user) {
      if (err) {
        return next(err)
      } else {
        return res.redirect('/dashboard');
      }
    });

  }
})

app.use(function(req, res) {
  res.type('text/html');
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
})

//server connection
const PORT = 4000;
app.set('port', process.env.PORT || PORT);
app.listen(app.get('port'), function() {
  console.log('app is listening on port:', PORT);
});
