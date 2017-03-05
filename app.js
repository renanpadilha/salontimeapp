var basicAuth = require('basic-auth');
var express = require('express');
var bodyParser = require('body-parser');
  var knex = require('./db');
var app = express();
var router = express.Router();
var port = process.env.PORT || 4002;
var session = require('express-session');
// app.use(session({
//   secret: '2C44-4D44-WppQ38S',
//   resave: true,
//   saveUninitialized: true
// }));

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

app.get('/api/v1/health', function(req, res) {
  res.send('Bem vindo a SALONTIME API');
});

var clientes = require('./server/clientes')(app, auth);
var estabelecimentos = require('./server/estabelecimentos')(app);
var profissionais = require('./server/profissionais')(app);
var categorias = require('./server/categorias')(app);
var servicos = require('./server/servicos')(app);

app.listen(port);
