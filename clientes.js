module.exports = function(app) {
  var knex  = require('./db');
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
}
