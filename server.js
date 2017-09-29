//package requirements
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');

//init app
const app = express();

//init mongodb
mongoose.connect('mongodb://localhost/SugarMamas');

const user = require('./controllers/UserController');
require('./config/passport.js');

//view engine
const handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//static/public folder
app.use(express.static(__dirname + '/public'));

//cookie parser
app.use(cookieParser());

// Express Session
app.use(session({
  secret: 'Y7N./%@r="CPxMa/d!5Y',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

app.use(flash());

// Passport init
app.use(passport.initialize());
app.use(passport.session());

app.use(user);

//server connection
const PORT = 4000;
// app.set('port', process.env.PORT || PORT);
// app.listen(app.get('port'), function() {
//   console.log('app is listening on port:', PORT);
// });

app.listen(process.env.PORT || 4000, function() {
  console.log('app is listening on port:', PORT);
});
