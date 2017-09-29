const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/UserModel');
const app = express();

router.get('/', function(req, res) {
  req.flash('logout', 'You have been logged out');
  console.log(req.baseUrl);
  res.render('user');
});

router.get('/logout', function(req, res) {
  console.log(req.baseUrl);
  res.redirect('/');
})

router.get('/register', function(req, res) {
  emailExists = req.flash('emailExists');
  res.render('user', {
    email_exists: emailExists
  });
});

router.get('/login', function(req, res) {
  loginError = req.flash('noEmail');
  passwordError = req.flash('incorrectPassword');
  res.render('user', {
    login_error: loginError,
    password_error: passwordError
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/register', passport.authenticate('local.signup', {
  successRedirect: '/dashboard',
  failureRedirect: '/register',
  failureFlash: true
}));

router.post('/login', passport.authenticate('local.login', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/dashboard', isLoggedIn, function(req, res) {
  res.render('dashboard', {user: req.user});
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
};

// //forgot password
// app.use(require('sesame')()); // for sessions
//
// var forgot = require('password-reset')({
//     uri : 'http://localhost:8080/password_reset',
//     from : 'password-robot@localhost',
//     host : 'localhost', port : 25,
// });
// app.use(forgot.middleware);
//
// app.post('/forgot', express.bodyParser(), function (req, res) {
//     var email = req.body.email;
//     var reset = forgot(email, function (err) {
//         if (err) res.end('Error sending message: ' + err)
//         else res.end('Check your inbox for a password reset message.')
//     });
//
//     reset.on('request', function (req_, res_) {
//         req_.session.reset = { email : email, id : reset.id };
//         fs.createReadStream(__dirname + '/forgot.html').pipe(res_);
//     });
// });
//
// app.post('/reset', express.bodyParser(), function (req, res) {
//     if (!req.session.reset) return res.end('reset token not set');
//
//     var password = req.body.password;
//     var confirm = req.body.confirm;
//     if (password !== confirm) return res.end('passwords do not match');
//
//     // update the user db here
//
//     forgot.expire(req.session.reset.id);
//     delete req.session.reset;
//     res.end('password reset');
// });

module.exports = router;
