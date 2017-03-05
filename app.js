var basicAuth = require('basic-auth');
var express = require('express');
var bodyParser = require('body-parser');
var knex = require('./db');
var app = express();
var router = express.Router();
var port = process.env.PORT || 4002;
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

app.use(express.static(__dirname + '/app'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Location, Authorization');
    res.setHeader('Access-Control-Expose-Headers', 'Location');
    next();
});

app.use(require('cookie-parser'));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.setHeader('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  knex.select('*').from('usuarios').where({username: user.name})
  .then(function(result) {
    if (user.name === result[0].username && user.pass === result[0].password) {
      return next();
    } else {
      return unauthorized(res);
    };
  });

};

passport.use(new Strategy(
  function(username, password, callback) {
    knex.select('*').from('usuarios').where({username: username})
    .then(function(usuario) {
      var user = usuario[0];
      if (!user) {
        return callback(null);
      }
      if (user.password !== password) {
        return callback(false);
      }
      return callback(user);
    });
  }));

passport.serializeUser(function(user, callback) {
  callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
  knex.select('*').from('usuarios').where({id: id})
  .then(function(usuario) {
    var user = usuario[0];
    callback(null, user);
  });
});

app.get('/api/v1/health',
  passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
  res.send('Bem vindo a SALONTIME API');
});

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.send('profile', { user: req.user });
  });

var clientes = require('./server/clientes')(app, auth);
var estabelecimentos = require('./server/estabelecimentos')(app, auth);
var profissionais = require('./server/profissionais')(app, auth);
var categorias = require('./server/categorias')(app, auth);
var servicos = require('./server/servicos')(app, auth);

app.listen(port);
