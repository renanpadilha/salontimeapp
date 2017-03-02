//var basicAuth = require('basic-auth');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var port = process.env.PORT || 4002;
var clientes = require('./server/clientes')(app);
var estabelecimentos = require('./server/estabelecimentos')(app);
var profissionais = require('./server/profissionais')(app);
var categorias = require('./server/categorias')(app);
var servicos = require('./server/servicos')(app);

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

app.get('/health', function(req, res) {
  res.send('Bem vindo a SALONTIME API');
});

app.listen(port);
