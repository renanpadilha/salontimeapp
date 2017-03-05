module.exports = function(app, auth) {
  var knex  = require('../db');
  app.get('/api/v1/clientes', auth, function(req, res, next) {
    knex.select("*").from('clientes').then(function(clientes) {
      console.log(clientes);
      res.json(clientes);
    });
  });

  app.get('/api/v1/clientes/:id', auth, function(req, res, next) {
    var id_cliente = req.params.id;
    knex.select("*").from('clientes').where({id: id_cliente}).then(function(cliente) {
      res.json(cliente);
    });
  });

  app.post('/api/v1/clientes', auth, function(req, res){
    var cliente = {
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      telefone: req.body.telefone
    };
    knex.insert(cliente).into('clientes').then(function(cliente) {
      res.status(201).json(cliente);
    });
  });

  app.put('/api/v1/clientes/:id', auth, function(req, res){
    var id = req.params.id;
    knex('clientes').where({id: id}).update(req.body).then(function(cliente) {
      res.status(204).json(cliente);
    });
  });

  app.delete('/api/v1/clientes/:id', auth, function(req, res){
    var id = req.params.id;
    knex('clientes').where({id: id}).del().then(function(cliente) {
      res.status(204).json();
    });
  });

  /* CRIA UM AGENDAMENTO */
  app.post('/api/v1/clientes/:id/agendamentos', auth, function(req, res){
    var agendamento = {
      id_cliente: req.params.id,
      id_estabelecimento: req.body.id_estabelecimento,
      id_profissional: req.body.id_profissional,
      id_servico: req.body.id_servico,
      data: req.body.data
    };
    knex.insert(agendamento).into('agendamentos').returning('*').then(function (data){
      res.setHeader('Location', auth, `/api/v1/clientes/${req.params.id}/agendamentos/${req.data.id}`);
      res.status(201).json(data);
    });
  });

  /* LISTA TODOS OS AGENDAMENTOS DE UM CLIENTE*/
  app.get('/api/v1/clientes/:id/agendamentos', auth, function(req, res){
    var id_cliente = req.params.id;
    knex.raw("SELECT a.id, s.nome AS servicoNome, a.data AS dataAgendamento, e.nome AS estabelecimentoNome, p.nome AS profissionalNome FROM agendamentos a JOIN estabelecimentos e ON a.id_estabelecimento = e.id JOIN servicos s ON a.id_servico = s.id JOIN profissionais p ON a.id_profissional = p.id WHERE id_cliente = ?", id_cliente)
    .then(function (agendamentos) {
      res.json(agendamentos.rows);
    }).catch(function(err) {
      console.log(err);
    });
  });

  /* LISTA UM AGENDAMENTO ESPECÍFICO */
  app.get('/api/v1/clientes/:id/agendamentos/:id_agendamento', auth, function(req, res){
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
  app.get('/api/v1/clientes/:id/estabelecimentos/:id_estabelecimento/agendamentos', auth, function(req, res){
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
  app.get('/api/v1/clientes/:id/estabelecimentos/:id_estabelecimento/agendamentos/:id_agendamento', auth, function(req, res){
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
}
