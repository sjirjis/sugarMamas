const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const User = require('../models/User.js');

module.exports = function(app) {

  //bodyparsing
  app.use(bodyParser.json());
  app.use(require('body-parser').urlencoded({
    extended: false
  }));

  //init validator
  app.use(expressValidator());

  app.post('/login', function(req, res) {
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();

    var loginErrors = req.validationErrors();
    if (loginErrors) {
      res.render('user', {
        loginErrors: loginErrors
      });
      return;
    } //else {

  });

  app.post('/register', function(req, res) {
    //for development only @todo remove for production
    //User.remove({}, function() {});

    // Validation
    //req.checkBody looks and name attr of Input element
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('zipCode', 'Zip Code is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var registrationErrors = req.validationErrors();
    if (registrationErrors) {
      res.render('user', {
        registrationErrors: registrationErrors
      });
      return;
    } else {

      var userData = {
        email: req.body.email,
        zipCode: req.body.zipCode,
        password: req.body.password
      };

      //create new user document using User model & userData
      var newUser = new User(userData);

      //store newUser document into the db
      newUser.save(function(err, newUser) {
        if (err) {
          return res.render('500', {
            error: err
          });
        } else {
          res.redirect('/dashboard');
        }
      });
    };
  });
};
