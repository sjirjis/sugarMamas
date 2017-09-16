const bodyParser = require('body-parser');
const User = require('../models/User.js');
const expressValidator = require('express-validator');

module.exports = function(app) {

  // const expressValidator = require('express-validator');
  app.use(expressValidator());

  //bodyparsing
  app.use(bodyParser.json());
  app.use(require('body-parser').urlencoded({
    extended: false
  }));

  app.get('/', function(req, res) {
    res.render('home');
  });

  app.get('/oldHome', function(req, res) {
    res.render('oldHome');
  });

  app.post('/register', function(req, res) {
    //for development only @todo remove for production
                  User.remove({}, function() {});

    var userData = {
      username: req.body.username,
      email: req.body.email,
      zipCode: req.body.zipCode,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    };

    // Validation
  	req.checkBody('username', 'Username is required').notEmpty();
  	req.checkBody('email', 'Email is required').notEmpty();
  	req.checkBody('email', 'Email is not valid').isEmail();
  	req.checkBody('username', 'Username is required').notEmpty();
  	req.checkBody('password', 'Password is required').notEmpty();
  	req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
      res.render('/', {
        errors: errors
      });
    } else {
      console.log('all good');

      //create new user document using User model & userData
      var newUser = new User(userData);

      //store newUser document into the db
      newUser.save(function (err, newUser) {
        if (err) {
          return res.render('500', {error: err});
        } else {
          res.send('yay!');
        }
      });
    };
  });

  //@todo breaks references to  assets
  // app.use(function(req, res) {
  //   res.type('text/html');
  //   res.status(404);
  //   res.render('404');
  // });

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
  });
}
