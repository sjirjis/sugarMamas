const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('logout', 'You have been logged out');
  res.redirect('/');
});

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
