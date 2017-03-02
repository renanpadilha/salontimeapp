//var basicAuth = require('basic-auth');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var port = process.env.PORT || 4002;
var knex = require('knex')({
  client: 'pg',
	connection: {
		host : 'localhost',
		user : 'postgres',
		password : '',
		database : 'salontime_dev',
		// ssl: true
		debug: ['ComQueryPacket']
	}
  // connection: {
  //   host : 'ec2-54-235-177-62.compute-1.amazonaws.com',
  //   user : 'asjofobobcqtsm',
  //   password : 'aLdrhhmSzZxOYmCYIG4i_pyxKy',
  //   database : 'd6pje4mqqq69d2',
  //   ssl: true
  //   //debug: ['ComQueryPacket']
  // }
});
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

/*##############################################################*/
/*###################### CLIENTES ######################*/
/*##############################################################*/
app.get('/api/v1/clientes', function(req, res, next) {
  knex.select("*").from('cliente').then(function(clientes) {
    console.log(clientes);
    res.json(clientes);
  });
});

app.get('/api/v1/clientes/:id', function(req, res, next) {
  var id_cliente = req.params.id;
  knex.select("*").from('cliente').where({id: id}).then(function(cliente) {
    res.json(cliente);
  });
});

app.post('/api/v1/clientes', function(req, res){
  var cliente = {
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha,
    telefone: req.body.telefone
  };
  knex.insert(cliente).into('cliente').then(function(cliente) {
    res.status(201).json(cliente);
  });
});

app.put('/api/v1/clientes/:id', function(req, res){
  var id = req.params.id;
  knex('cliente').where({id: id}).update(req.body).then(function(cliente) {
    res.status(204).json(cliente);
  });
});

app.delete('/api/v1/clientes/:id', function(req, res){
  var id = req.params.id;
  knex('cliente').where({id: id}).del().then(function(cliente) {
    res.status(204).json();
  });
});

/* CRIA UM AGENDAMENTO */
app.post('/api/v1/clientes/:id/agendamentos', function(req, res){
  var agendamento = {
    id_cliente: req.params.id,
    id_estabelecimento: req.body.id_estabelecimento,
    id_profissional: req.body.id_profissional,
    id_servico: req.body.id_servico,
    data: req.body.data
  };
  knex.insert(agendamento).into('agendamento').returning('*').then(function (data){
    res.setHeader('Location', `/api/v1/clientes/${req.params.id}/agendamentos/${req.data.id}`);
    res.status(201).json(data);
  });
});

/* EXCLUI UM AGENDAMENTO */
app.delete('/api/v1/agendamentos/:id', function(req, res) {
  id_agendamento = req.params.id;
  knex('agendamento').where({id: id_agendamento}).del()
  .then(function(id) {
    console.log('Agendamento' + id + 'cancelado');
    res.status(204).json();
  }).catch(function(error) {
    console.log(error);
  });
});

/* LISTA TODOS OS AGENDAMENTOS DE UM CLIENTE*/
app.get('/api/v1/clientes/:id/agendamentos', function(req, res){
  var id_cliente = req.params.id;
  knex.raw("SELECT a.id, s.nome AS servicoNome, a.data AS dataAgendamento, e.nome AS estabelecimentoNome, p.nome AS profissionalNome FROM agendamento a JOIN estabelecimento e ON a.id_estabelecimento = e.id JOIN servico s ON a.id_servico = s.id JOIN profissional p ON a.id_profissional = p.id WHERE id_cliente = ?", id_cliente)
  .then(function (agendamentos) {
    res.json(agendamentos.rows);
  }).catch(function(err) {
    console.log(err);
  });
});

/* LISTA UM AGENDAMENTO ESPECÍFICO */
app.get('/api/v1/clientes/:id/agendamentos/:id_agendamento', function(req, res){
  var id_cliente = req.params.id;
  var id_agendamento = req.params.id_agendamento;
  knex.select('*').from('agendamento').where({id: id_agendamento, id_cliente: id_cliente}).then(function (agendamentos) {
    console.log(agendamentos);
    res.json(agendamentos);
  }).catch(function(err) {
    console.log(err);
  });
});

/* LISTA OS AGENDAMENTOS DE UM CLIENTE PARA UM ESTABELECIMENTO*/
app.get('/api/v1/clientes/:id/estabelecimentos/:id_estabelecimento/agendamentos', function(req, res){
  var id_cliente = req.params.id;
  var id_estabelecimento = req.params.id_estabelecimento;
  knex.select('*').from('agendamento').where({id_estabelecimento: id_estabelecimento, id_cliente: id_cliente}).then(function (agendamentos) {
    console.log(agendamentos);
    res.json(agendamentos);
  }).catch(function(err) {
    console.log(err);
  });
});

/* LISTA O AGENDAMENTO ESPECÍFICO DE UM CLIENTE PARA UM ESTABELECIMENTO*/
app.get('/api/v1/clientes/:id/estabelecimentos/:id_estabelecimento/agendamentos/:id_agendamento', function(req, res){
  var id_cliente = req.params.id;
  var id_estabelecimento = req.params.id_estabelecimento;
  var id_agendamento = req.params.id_agendamento;
  knex.select('*')
  .from('agendamento')
  .where({id_estabelecimento: id_estabelecimento, id_cliente: id_cliente, id: id_agendamento})
  .then(function (agendamentos) {
    console.log(agendamentos);
    res.json(agendamentos);
  }).catch(function(err) {
    console.log(err);
  });
});
/*##############################################################*/
/*###################### ESTABELECIMENTOS ######################*/
/*##############################################################*/
app.get('/api/v1/estabelecimentos/', function(req, res){
  knex.select("*").from('estabelecimento').then(function(estabelecimentos) {
    res.json(estabelecimentos);
  });
});

app.get('/api/v1/estabelecimentos/:id', function(req, res, next) {
  var id = req.params.id;
  knex.select("*").from('estabelecimento').where({id: id}).then(function(estabelecimento) {
    res.json(estabelecimento);
  });
});

app.post('/api/v1/estabelecimentos', function(req, res){
  var estabelecimento = {
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha,
    endereco: req.body.endereco,
    telefone: req.body.telefone
  };
  knex.insert(estabelecimento).into('estabelecimento').then(function(estabelecimento) {
    res.status(201).json(estabelecimento);
  });
});

app.put('/api/v1/estabelecimentos/:id', function(req, res){
  var id = req.params.id;
  knex('estabelecimento').where({id: id}).update(req.body).then(function(estabelecimento) {
    res.status(204).json(estabelecimento);
  });
});

app.delete('/api/v1/estabelecimentos/:id', function(req, res){
  var id = req.params.id;
  knex('estabelecimento').where({id: id}).del()
  .then(function(estabelecimento) {
    res.status(204).json();
  });
});

/* LISTA OS AGENDAMENTOS DO ESTABELECIMENTO*/
app.get('/api/v1/estabelecimentos/:id/agendamentos', function(req, res){
  var id_estabelecimento = req.params.id;
  knex.raw("SELECT a.id, s.nome AS servicoNome, a.data AS dataAgendamento, c.nome AS clienteNome, p.nome AS profissionalNome FROM agendamento a JOIN cliente c ON a.id_cliente = c.id JOIN servico s ON a.id_servico = s.id JOIN profissional p ON a.id_profissional = p.id WHERE a.id_estabelecimento = ?", id_estabelecimento)
  .then(function (agendamentos) {
    res.json(agendamentos.rows);
  }).catch(function(err) {
    console.log(err);
  });
});

/* LISTA OS PROFISSIONAIS DO ESTABELECIMENTO*/

app.get('/api/v1/estabelecimentos/:id/profissionais', function(req, res){
  var id_estabelecimento = req.params.id;
  knex.raw("SELECT p.id, p.nome, p.email, p.telefone, p.porcentagem FROM profissional p JOIN estabelecimento e ON p.id_estabelecimento = e.id WHERE e.id = ?", id_estabelecimento)
  .then(function (profissionais) {
    res.json(profissionais.rows);
  }).catch(function(err) {
    console.log(err);
  });
});

/* LISTA OS AGENDAMENTOS DE UM CLIENTE ESPECÍFICO*/
app.get('/api/v1/estabelecimentos/:id/agendamentos/clientes/:id_cliente', function(req, res) {
  var id_estabelecimento = req.params.id;
  var id_cliente = req.params.id_cliente;
  knex.select('*').from('agendamento').where({id_estabelecimento: id_estabelecimento, id_cliente: id_cliente}).then(function (agendamentos) {
    console.log(agendamentos);
    res.json(agendamentos);
  }).catch(function(err) {
    console.log(err);
  });
});

/*LISTA OS AGENDAMENTOS DE UM PROFISSIONAL ESPECÍFICO*/
app.get('/api/v1/estabelecimentos/:id/agendamentos/profissionais/:id_profissional', function(req, res) {
  var id_estabelecimento = req.params.id;
  var id_profissional = req.params.id_profissional;
  knex.select('*').from('agendamento').where({id_estabelecimento: id_estabelecimento, id_profissional: id_profissional}).then(function (agendamentos) {
    console.log(agendamentos);
    res.json(agendamentos);
  }).catch(function(err) {
    console.log(err);
  });
});

/*LISTA OS AGENDAMENTOS DE UM SERVIÇO ESPECÍFICO*/
app.get('/api/v1/estabelecimentos/:id/agendamentos/servicos/:id_servico', function(req, res) {
  var id_estabelecimento = req.params.id;
  var id_servico = req.params.id_servico;
  knex.select('*').from('agendamento').where({id_estabelecimento: id_estabelecimento, id_servico: id_servico}).then(function (agendamentos) {
    console.log(agendamentos);
    res.json(agendamentos);
  }).catch(function(err) {
    console.log(err);
  });
});

/*LISTA OS CLIENTES QUE JÁ FORAM ATENDIDOS EM DETERMINADO ESTABELECIMENTO */

app.get('/api/v1/estabelecimentos/:id/clientes/', function(req, res) {
  var id_estabelecimento = req.params.id;
  knex.select('id_cliente').from('agendamento').where({id_estabelecimento: id_estabelecimento}).then(function (agendamentos) {
    console.log(agendamentos);
    res.json(agendamentos);
  }).catch(function(err) {
    console.log(err);
  });
});

/* CRIA UM SERVIÇO RELACIONADO AO ESTABELECIMENTO */
app.post('/api/v1/estabelecimentos/:id/servicos/:id_servico', function(req, res){
  var servico_estabelecimento = {
    id_estabelecimento: req.params.id,
    id_servico: req.params.id_servico, // ID DO SERVIÇO PRIMÁRIO EX: BARBA, CABELO, MANICURE E PEDICURE
    descricao: req.body.descricao,
    preco: req.body.preco,
    duracao: req.body.duracao
  };
  knex.insert(servico_estabelecimento).into('estabelecimento_servico').then(function (id){
    console.log(id);
    res.status(201).json(servico_estabelecimento);
  });
});

/*##############################################################*/
/*###################### PROFISSIONAL ######################*/
/*##############################################################*/

app.get('/api/v1/profissionais/', function(req, res){
  knex.select("*").from('profissional').then(function(profissional) {
    res.json(profissional);
  });
});

app.get('/api/v1/profissionais/:id', function(req, res, next) {
  var id = req.params.id;
  knex.select("*").from('profissional').where({id: id}).then(function(profissional) {
    res.json(profissional);
  });
});

app.post('/api/v1/profissionais', function(req, res){
  var profissional = {
    nome: req.body.nome,
    telefone: req.body.telefone,
    email: req.body.email,
    porcentagem: req.body.porcentagem,
    id_estabelecimento: req.body.id_estabelecimento
  };
  knex.insert(profissional).into('profissional').then(function(profissional) {
    res.status(201).json(profissional);
  });
});

app.put('/api/v1/profissionais/:id', function(req, res){
  var id = req.params.id;
  knex('profissional').where({id: id}).update(req.body).then(function(profissional) {
    res.status(204).json(profissional);
  });
});

app.delete('/api/v1/profissionais/:id', function(req, res){
  var id = req.params.id;
  knex('profissional').where({id: id}).del().then(function(profissional) {
    res.status(204).json();
  });
});

/* ASSOCIA UM PROFISSIONAL A UM SERVIÇO */
app.post('/api/v1/profissionais/:id/servicos', function(req, res){
  var id = req.params.id;
  var id_servico = req.body.id_servico;
  knex.insert({id_profissional: id, id_servico: id_servico}).then(function(profissional_servico) {
    res.status(201).json(profissional_servico);
  });
});

/* LISTA OS SERVIÇOS ESPECÍFICOS DE CADA PROFISSIONAL*/
app.get('/api/v1/profissionais/:id/servicos', function(req, res){
  var id = req.params.id;
  knex.raw("SELECT e.id_servico AS servico_primario, e.descricao, p.nome FROM profissional_servico ps JOIN estabelecimento_servico e ON e.id_servico = ps.id_servico JOIN profissional p ON ps.id_profissional = p.id WHERE ps.id_profissional = ?", id)
  .then(function(id){
    console.log(id);
    res.json(id.rows);
  }).catch(function(err) {
    console.log(err);
  });
});

/* LISTA OS PROFISSIONAIS DE UM ESTABELECIMENTO QUE TEM UM SERVIÇO ESPECIFICO */
app.get('/api/v1/estabelecimentos/:id/servicos/:id_servico/profissionais', function(req, res){
  var id = req.params.id;
  var id_servico= req.params.id_servico;
  knex.raw("SELECT DISTINCT p.id, p.nome FROM profissional p JOIN profissional_servico ps ON p.id = ps.id_profissional JOIN estabelecimento e ON p.id_estabelecimento = e.id WHERE ps.id_servico = ? AND e.id = ?", [id, id_servico])
  .then(function(response){
    console.log(response);
    res.json(response.rows);
  }).catch(function(err) {
    console.log(err);
  });
});
/*##############################################################*/
/*###################### CATEGORIAS PRIMÁRIOS ######################*/
/*##############################################################*/

app.get('/api/v1/categorias/', function(req, res){
  knex.select("*").from('categoria').then(function(categorias) {
    res.json(categorias);
  });
});

app.get('/api/v1/categorias/:id', function(req, res, next) {
  var id = req.params.id;
  knex.select("*").from('categoria').where({id: id}).then(function(categoria) {
    res.json(categoria);
  });
});

app.post('/api/v1/categorias', function(req, res){
  var categoria = {
    nome: req.body.nome
  };
  knex.insert(categoria).into('servico').then(function(categoria) {
    res.status(201).json(categoria);
  });
});

app.put('/api/v1/categorias/:id', function(req, res){
  var id = req.params.id;
  knex('categoria').where({id: id}).update(req.body).then(function(categoria) {
    res.status(204).json(categoria);
  });
});

app.delete('/api/v1/categorias/:id', function(req, res){
  var id = req.params.id;
  knex('categoria').where({id: id}).del().then(function(categoria) {
    res.status(204).json();
  });
});

/*##############################################################*/
/*###################### CATEGORIAS PRIMÁRIOS ######################*/
/*##############################################################*/

app.get('/api/v1/servicos/', function(req, res){
  knex.select("*").from('servico').then(function(servicos) {
    res.json(servicos);
  });
});

app.get('/api/v1/servicos/:id', function(req, res, next) {
  var id = req.params.id;
  knex.select("*").from('servico').where({id: id}).then(function(servico) {
    res.json(servico);
  });
});

app.post('/api/v1/servicos', function(req, res){
  var servico = {
    nome: req.body.nome
  };
  knex.insert(servico).into('servico').then(function(servico) {
    res.status(201).json(servico);
  });
});

app.put('/api/v1/servicos/:id', function(req, res){
  var id = req.params.id;
  knex('servico').where({id: id}).update(req.body).then(function(servico) {
    res.status(204).json(servico);
  });
});

app.delete('/api/v1/servicos/:id', function(req, res){
  var id = req.params.id;
  knex('servico').where({id: id}).del().then(function(servico) {
    res.status(204).json();
  });
});
/* LISTA TODOS OS SERVIÇOS VINCULADOS A UMA CATEGORIA ESPECIFICA*/
app.get('/api/v1/categorias/:id/servicos', function(req, res){
  var id = req.params.id;
  knex.raw('SELECT s.id, s.nome FROM servico s JOIN categoria c ON s.id_categoria = c.id WHERE s.id_categoria = ?;', id)
  .then(function(id){
    console.log(id);
    res.json(id.rows);
  }).catch(function(err) {
    console.log(err);
  });
});
/* LISTA TODOS OS ESTABELECIMENTOS QUE POSSUEM UM SERVIÇO PRIMÁRIO ESPECÍFICO */
app.get('/api/v1/servicos/:id/estabelecimentos', function(req, res){
  var id = req.params.id;
  knex.raw('SELECT e.id, e.nome, e.endereco, es.id_servico FROM  estabelecimento e JOIN estabelecimento_servico es ON es.id_estabelecimento = e.id WHERE es.id_servico = ? GROUP BY e.id, e.nome, e.endereco, es.id_servico;', id)
  .then(function(id){
    console.log(id);
    res.json(id.rows);
  }).catch(function(err) {
    console.log(err);
  });
});

app.listen(port);
