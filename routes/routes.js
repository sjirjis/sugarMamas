// const passport = require('passport');
//
// module.exports = function(app) {
//   app.get('/', function(req, res) {
//     res.render('user');
//   });
//
//   app.get('/dashboard', function(req, res) {
//     res.render('dashboard', {user: req.user});
//   });
//
//   //@todo breaks references to  assets
//   // app.use(function(req, res) {
//   //   res.type('text/html');
//   //   res.status(404);
//   //   res.render('404');
//   // });
//
//   app.use(function(err, req, res, next) {
//     console.error(err.stack);
//     res.status(500);
//     res.render('500');
//   });
// };
