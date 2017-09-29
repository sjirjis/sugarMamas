const express = require('express');
const router = express.Router();

const passport = require('passport');

const User = require('../models/UserModel');

router.get('/', function(req, res) {
  req.flash('logout', 'You have been logged out');
  res.render('user');
});

router.get('/logout', function(req, res) {
  req.flash('logout');
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

module.exports = router;
