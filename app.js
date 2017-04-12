var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var port = process.env.PORT || 4002;
var knex  = require('./db');

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

function auth(req, res, next) {
	var authorization = req.headers.authorization;
	if(!authorization) {
		res.sendStatus(401);
		return;
	}
	var parts = authorization.trim().split(' ');

	switch (parts[0]) {
		case 'Basic':
			var secret = new Buffer(parts[1], 'base64').toString();
			var credentials = secret.split(':');

			getUsuarioByCredentials(credentials)
			.then(function(users) {
				if(users.length === 0) {
					res.sendStatus(401);
					return;
				}
				req.user = users[0];
				next();
			}).catch(function(error) {
				console.warn(error);
				res.sendStatus(401);
				return;
			});
			break;
		case 'Token':
			var token = parts[1].split('=')[1];
			getUsuarioByToken(token)
			.then(function(users) {
				if(users.length === 0) {
					res.sendStatus(401);
					return;
				}
				req.user = users[0];
				next();
			}).catch(function(error) {
				console.warn(error);
				res.sendStatus(401);
				return;
			});
			break;
		default:
			res.sendStatus(401);
			return;
	}
};

function getUsuarioByCredentials(credentials) {
	return knex.select("*").from('usuarios').where({username: credentials[0], password: credentials[1]});
}

function getUsuarioByToken(token) {
	return knex.select("*").from('usuarios').where({token: token});
}

app.get('/health', function(req, res) {
  res.send('Bem vindo a SALONTIME API');
});

// AUTÊNTICAÇÃO

app.get('/api/v1/clientelogado/:id', function(req, res) {
	knex.raw('SELECT * FROM clientes WHERE id_usuario =  ?', req.params.id)
	.then(function (cliente) {
		res.json(cliente.rows);
	}).catch(function(err) {
		console.log(err);
	});
});

app.get('/api/v1/estabelecimentologado/:id', function(req, res) {
	knex.raw('SELECT * FROM estabelecimentos WHERE id_usuario =  ?', req.params.id)
	.then(function (estabelecimento) {
		res.json(estabelecimento.rows);
	}).catch(function(err) {
		console.log(err);
	});
});

app.post('/api/v1/authentication', function(req, res, next) {
	getUsuarioByCredentials(req.body)
	.then(function(users) {
		if(users.length === 0) {
			res.sendStatus(401);
			return;
		}
		req.user = users[0];
		res.send(req.user);
		next();
	}).catch(function(error) {
		console.warn(error);
		res.sendStatus(401);
		return;
	});
});

app.post('/api/v1/register', function(req, res) {
	var usuario = {
		username: req.body.username,
		password: req.body.password,
		tipo: req.body.tipo
	};
	knex.insert(usuario).into('usuarios').returning('*')
	.then(function(usuario) {
		res.status(201).json(usuario);
	});
});

// END AUTÊNTICAÇÃO

//
// BLACKLIST
//
app.get('/api/v1/blacklist/:id', function(req, res) {
	var id_cliente = req.params.id;
	knex('blacklist').where({id_cliente: id_cliente})
	.then(function(blacklisted) {
		res.json(blacklisted);
	}).catch(function(error) {
		console.warn(error);
	});
});

app.post('/api/v1/blacklist', function(req, res) {
	var blacklisted = {
		id_cliente: req.body.nome,
		id_estabelecimento: req.body.id_estabelecimento
	};
	knex.insert(blacklisted).into('blacklist')
	.then(function(blacklisted) {
		res.status(201).json(blacklisted);
	});
});
//
// END BLACKLIST
//

//
// AGENDAMENTOS
//
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

app.patch('/api/v1/agendamentos/:id', function(req, res) {
	id = req.params.id;
	knex('agendamentos').where({id: id}).update(req.body)
	.then(function(agendamento) {
		res.json(agendamento);
	});
});
//
// FIM AGENDAMENTOS
//

//
// CLIENTES
//

app.get('/api/v1/clientes', auth, function(req, res, next) {
	knex.select("*").from('clientes')
	.then(function(clientes) {
		console.log(clientes);
		res.json(clientes);
	});
});

app.get('/api/v1/clientes/:id', function(req, res, next) {
	var id = req.params.id;
	knex.select("*").from('clientes').where({id: id})
	.then(function(cliente) {
		res.json(cliente);
	});
});

app.post('/api/v1/clientes', function(req, res){
	var cliente = {
		nome: req.body.nome,
		email: req.body.email,
		id_usuario: req.body.id_usuario,
		telefone: req.body.telefone
	};
	knex.insert(cliente).into('clientes')
	.then(function(cliente) {
		res.status(201).json(cliente);
	});
});

app.put('/api/v1/clientes/:id', function(req, res){
	var id = req.params.id;
	knex('clientes').where({id: id}).update(req.body).then(function(cliente) {
		res.status(204).json(cliente);
	});
});

app.delete('/api/v1/clientes/:id', function(req, res){
	var id = req.params.id;
	knex('clientes').where({id: id}).del().then(function(cliente) {
		res.status(204).json();
	});
});

/* CRIA UM AGENDAMENTO */
app.post('/api/v1/clientes/:id/agendamentos', function(req, res) {
	var agendamento = {
		data: req.body.data,
		id_estabelecimento: req.body.id_estabelecimento,
		id_cliente: req.params.id,
		id_profissional: req.body.id_profissional,
		id_servico: req.body.id_servico
	};
	knex.insert(agendamento).into('agendamentos').returning('*')
	.then(function (data){
		res.status(201).json(data);
	});
});

/* LISTA TODOS OS AGENDAMENTOS DE UM CLIENTE*/
app.get('/api/v1/clientes/:id/agendamentos', function(req, res){
	var id_cliente = req.params.id;
	knex.raw("SELECT a.id, s.nome AS servicoNome, a.data AS dataAgendamento, a.rate, a.atendido, e.nome AS estabelecimentoNome, p.nome AS profissionalNome FROM agendamentos a JOIN estabelecimentos e ON a.id_estabelecimento = e.id JOIN servicos s ON a.id_servico = s.id JOIN profissionais p ON a.id_profissional = p.id WHERE id_cliente = ?", id_cliente)
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
	knex.select('*').from('agendamentos').where({id: id_agendamento, id_cliente: id_cliente}).then(function (agendamentos) {
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
	knex.select('*').from('agendamentos').where({id_estabelecimento: id_estabelecimento, id_cliente: id_cliente}).then(function (agendamentos) {
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
	.from('agendamentos')
	.where({id_estabelecimento: id_estabelecimento, id_cliente: id_cliente, id: id_agendamento})
	.then(function (agendamentos) {
		console.log(agendamentos);
		res.json(agendamentos);
	}).catch(function(err) {
		console.log(err);
	});
});

//
// FIM CLIENTES
//

//
// ESTABELECIMENTOS
//

app.get('/api/v1/estabelecimentos/', function(req, res){
	knex.select("*").from('estabelecimentos').then(function(estabelecimentos) {
		res.json(estabelecimentos);
	});
});

app.get('/api/v1/estabelecimentos/:id', function(req, res, next) {
	var id = req.params.id;
	knex.select("*").from('estabelecimentos').where({id: id}).then(function(estabelecimento) {
		res.json(estabelecimento);
	});
});

app.post('/api/v1/estabelecimentos', function(req, res){
	var estabelecimento = {
		nome: req.body.nome,
		email: req.body.email,
		id_usuario: req.body.id_usuario,
		endereco: req.body.endereco,
		telefone: req.body.telefone
	};
	knex.insert(estabelecimento).into('estabelecimentos').then(function(estabelecimento) {
		res.status(201).json(estabelecimento);
	});
});

app.put('/api/v1/estabelecimentos/:id', function(req, res){
	var id = req.params.id;
	knex('estabelecimentos').where({id: id}).update(req.body).then(function(estabelecimento) {
		res.status(204).json(estabelecimento);
	});
});

app.delete('/api/v1/estabelecimentos/:id', function(req, res){
	var id = req.params.id;
	knex('estabelecimentos').where({id: id}).del()
	.then(function(estabelecimento) {
		res.status(204).json();
	});
});

/* LISTA OS AGENDAMENTOS DO ESTABELECIMENTO*/
app.get('/api/v1/estabelecimentos/:id/agendamentos', function(req, res){
	var id_estabelecimento = req.params.id;
	knex.raw("SELECT a.id, s.nome AS servicoNome, a.data AS dataAgendamento, a.atendido, c.nome AS clienteNome, c.id AS idCliente, p.nome AS profissionalNome FROM agendamentos a JOIN clientes c ON a.id_cliente = c.id JOIN servicos s ON a.id_servico = s.id JOIN profissionais p ON a.id_profissional = p.id WHERE a.id_estabelecimento = ?", id_estabelecimento)
	.then(function (agendamentos) {
		res.json(agendamentos.rows);
	}).catch(function(err) {
		console.log(err);
	});
});

/* LISTA OS PROFISSIONAIS DO ESTABELECIMENTO*/

app.get('/api/v1/estabelecimentos/:id/profissionais', function(req, res){
	var id_estabelecimento = req.params.id;
	knex.raw("SELECT p.id, p.nome, p.email, p.telefone, p.porcentagem FROM profissionais p JOIN estabelecimentos e ON p.id_estabelecimento = e.id WHERE e.id = ?", id_estabelecimento)
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
	knex.select('*').from('agendamentos').where({id_estabelecimento: id_estabelecimento, id_cliente: id_cliente}).then(function (agendamentos) {
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
	knex.select('*').from('agendamentos').where({id_estabelecimento: id_estabelecimento, id_profissional: id_profissional}).then(function (agendamentos) {
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
	knex.select('*').from('agendamentos').where({id_estabelecimento: id_estabelecimento, id_servico: id_servico}).then(function (agendamentos) {
		console.log(agendamentos);
		res.json(agendamentos);
	}).catch(function(err) {
		console.log(err);
	});
});

/*LISTA OS CLIENTES QUE JÁ FORAM ATENDIDOS EM DETERMINADO ESTABELECIMENTO */

app.get('/api/v1/estabelecimentos/:id/clientes/', function(req, res) {
	var id_estabelecimento = req.params.id;
	knex.select('id_cliente').from('agendamentos').where({id_estabelecimento: id_estabelecimento}).then(function (agendamentos) {
		console.log(agendamentos);
		res.json(agendamentos);
	}).catch(function(err) {
		console.log(err);
	});
});

app.get('/api/v1/estabelecimentos/:id/servicos/', function(req, res) {
	var id_estabelecimento = req.params.id;
	knex.raw("SELECT es.id, es.preco, es.id_estabelecimento, es.id_servico, s.nome FROM estabelecimentos_servicos es JOIN servicos s ON es.id_servico = s.id JOIN estabelecimentos e ON es.id_estabelecimento = e.id WHERE es.id_estabelecimento = ?", id_estabelecimento)
	.then(function (servicos) {
		res.json(servicos.rows);
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
	knex.insert(servico_estabelecimento).into('estabelecimentos_servicos').then(function (id){
		console.log(id);
		res.status(201).json(servico_estabelecimento);
	});
});

/* LISTA OS PROFISSIONAIS DE UM ESTABELECIMENTO QUE TEM UM SERVIÇO ESPECIFICO */
app.get('/api/v1/estabelecimentos/:id/servicos/:id_servico/profissionais', function(req, res){
	var id = req.params.id;
	var id_servico= req.params.id_servico;
	knex.raw("SELECT DISTINCT p.id, p.nome FROM profissionais p JOIN profissionais_servicos ps ON p.id = ps.id_profissional JOIN estabelecimentos e ON p.id_estabelecimento = e.id WHERE ps.id_servico = ? AND e.id = ?", [id, id_servico])
	.then(function(response){
		console.log(response);
		res.json(response.rows);
	}).catch(function(err) {
		console.log(err);
	});
});

app.get('/api/v1/estabelecimentos/:id/servicos/:id_servico/precos', function(req, res){
	var id = req.params.id;
	var id_servico = req.params.id_servico;
	knex.raw("SELECT DISTINCT es.id, es.preco from estabelecimentos_servicos es JOIN estabelecimentos e ON e.id = es.id_estabelecimento JOIN servicos s ON s.id = es.id_servico WHERE e.id = ? AND s.id = ?;", [id, id_servico])
	.then(function(response){
		console.log(response);
		res.json(response.rows);
	}).catch(function(err) {
		console.log(err);
	});
});

//
// FIM ESTABELECIMENTOS
//

//
// PROFISSIONAIS
//
app.get('/api/v1/profissionais/', function(req, res){
	knex.select("*").from('profissionais').then(function(profissional) {
		res.json(profissional);
	});
});

app.get('/api/v1/profissionais/:id', function(req, res, next) {
	var id = req.params.id;
	knex.select("*").from('profissionais').where({id: id}).then(function(profissional) {
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
	knex.insert(profissional).into('profissionais').then(function(profissional) {
		res.status(201).json(profissional);
	});
});

app.put('/api/v1/profissionais/:id', function(req, res){
	var id = req.params.id;
	knex('profissionais').where({id: id}).update(req.body).then(function(profissional) {
		res.status(204).json(profissional);
	});
});

app.delete('/api/v1/profissionais/:id', function(req, res){
	var id = req.params.id;
	knex('profissionais').where({id: id}).del()
	.then(function(profissional) {
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
//
// FIM PROFISSIONAIS
//

//
// SERVIÇOS
//
app.get('/api/v1/servicos/', function(req, res){
	knex.select("*").from('servicos').then(function(servicos) {
		res.json(servicos);
	});
});

app.get('/api/v1/servicos/:id', function(req, res, next) {
	var id = req.params.id;
	knex.select("*").from('servicos').where({id: id}).then(function(servico) {
		res.json(servico);
	});
});

app.post('/api/v1/servicos', function(req, res){
	var servico = {
		nome: req.body.nome
	};
	knex.insert(servico).into('servicos').then(function(servico) {
		res.status(201).json(servico);
	});
});

app.put('/api/v1/servicos/:id', function(req, res){
	var id = req.params.id;
	knex('servicos').where({id: id}).update(req.body).then(function(servico) {
		res.status(204).json(servico);
	});
});

app.delete('/api/v1/servicos/:id', function(req, res){
	var id = req.params.id;
	knex('servicos').where({id: id}).del().then(function(servico) {
		res.status(204).json();
	});
});

/* LISTA TODOS OS ESTABELECIMENTOS QUE POSSUEM UM SERVIÇO PRIMÁRIO ESPECÍFICO */
app.get('/api/v1/servicos/:id/estabelecimentos', function(req, res){
	var id = req.params.id;
	knex.raw('SELECT e.id, e.nome, e.endereco, es.id_servico FROM  estabelecimentos e JOIN estabelecimentos_servicos es ON es.id_estabelecimento = e.id WHERE es.id_servico = ? GROUP BY e.id, e.nome, e.endereco, es.id_servico;', id)
	.then(function(id){
		console.log(id);
		res.json(id.rows);
	}).catch(function(err) {
		console.log(err);
	});
});
//
// FIM SERVIÇOS
//

//
// CATEGORIAS
//
app.get('/api/v1/categorias/', function(req, res){
	knex.select("*").from('categorias')
	.then(function(categorias) {
		res.json(categorias);
	});
});

app.get('/api/v1/categorias/:id', function(req, res, next) {
	var id = req.params.id;
	knex.select("*").from('categorias').where({id: id})
	.then(function(categoria) {
		res.json(categoria);
	});
});

app.post('/api/v1/categorias', function(req, res){
	var categoria = {
		nome: req.body.nome
	};
	knex.insert(categoria).into('servicos')
	.then(function(categoria) {
		res.status(201).json(categoria);
	});
});

app.put('/api/v1/categorias/:id', function(req, res){
	var id = req.params.id;
	knex('categorias').where({id: id}).update(req.body)
	.then(function(categoria) {
		res.status(204).json(categoria);
	});
});

app.delete('/api/v1/categorias/:id', function(req, res){
	var id = req.params.id;
	knex('categorias').where({id: id}).del()
	.then(function(categoria) {
		res.status(204).json();
	});
});

/* LISTA TODOS OS SERVIÇOS VINCULADOS A UMA CATEGORIA ESPECIFICA*/
app.get('/api/v1/categorias/:id/servicos', function(req, res){
	var id = req.params.id;
	knex.raw('SELECT s.id, s.nome FROM servicos s JOIN categorias c ON s.id_categoria = c.id WHERE s.id_categoria = ?;', id)
	.then(function(id){
		console.log(id);
		res.json(id.rows);
	}).catch(function(err) {
		console.log(err);
	});
});
//
// FIM CATEGORIAS
//

//
// PROMOÇÕES
//

app.get('/api/v1/promocoes', function(req, res, next) {
	knex.select("*").from('promocoes')
	.then(function(promocoes) {
		res.json(promocoes);
	});
});

app.get('/api/v1/promocoes/:id', function(req, res, next) {
	var id = req.params.id;
	knex.raw("SELECT p.id, p.nome, p.preco, p.id_estabelecimento, p.id_servico, s.nome as servico FROM promocoes p JOIN servicos s ON p.id_servico = s.id WHERE p.id = ?", id)
	.then(function(promocao) {
		res.json(promocao.rows);
	});
});

app.get('/api/v1/estabelecimentos/:id/promocoes', function(req, res, next) {
	var id = req.params.id;
	knex.raw("SELECT p.id, p.nome, p.preco, s.nome as servico FROM promocoes p JOIN servicos s ON p.id_servico = s.id JOIN estabelecimentos e ON p.id_estabelecimento = e.id WHERE e.id = ?", id)
	.then(function(promocoes) {
		res.json(promocoes.rows);
	});
});

app.get('/api/v1/estabelecimentos/:id/servicos/:id_servico/promocoes', function(req, res, next) {
	var id = req.params.id;
	var id_servico = req.params.id_servico;
	knex.raw("SELECT p.id, p.nome, p.preco, s.id, s.nome, e.id FROM promocoes p JOIN servicos s ON p.id_servico = s.id JOIN estabelecimentos e ON p.id_estabelecimento = e.id WHERE s.id = ? AND e.id = ?", [id_servico, id])
	.then(function(promocoes) {
		res.json(promocoes);
	});
});

app.post('/api/v1/promocoes', function(req, res) {
	var promocao = {
		nome: req.body.nome,
		preco: req.body.preco,
		id_estabelecimento: req.body.id_estabelecimento,
		id_servico: req.body.id_servico
	};
	knex.insert(promocao).into('promocoes').returning('*')
	.then(function(promocao) {
		res.status(201).json(promocao);
	});
});

app.delete('/api/v1/promocoes/:id', function(req, res){
	var id = req.params.id;
	knex('promocoes').where({id: id}).del()
	.then(function(promocao) {
		res.status(204).json();
	});
});

app.put('/api/v1/promocoes/:id', function(req, res){
	var id = req.params.id;
	knex('promocoes').where({id: id}).update(req.body)
	.then(function(promocoes) {
		res.status(204).json(promocoes);
	});
});
//
// FIM PROMOÇÕES
//


app.listen(port);
