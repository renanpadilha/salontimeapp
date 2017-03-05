module.exports = function(app, auth) {
  var knex = require('../db');
  app.get('/api/v1/estabelecimentos/', auth, function(req, res){
    knex.select("*").from('estabelecimentos').then(function(estabelecimentos) {
      res.json(estabelecimentos);
    });
  });

  app.get('/api/v1/estabelecimentos/:id', auth, function(req, res, next) {
    var id = req.params.id;
    knex.select("*").from('estabelecimentos').where({id: id}).then(function(estabelecimento) {
      res.json(estabelecimento);
    });
  });

  app.post('/api/v1/estabelecimentos', auth, function(req, res){
    var estabelecimento = {
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      endereco: req.body.endereco,
      telefone: req.body.telefone
    };
    knex.insert(estabelecimento).into('estabelecimentos').then(function(estabelecimento) {
      res.status(201).json(estabelecimento);
    });
  });

  app.put('/api/v1/estabelecimentos/:id', auth, function(req, res){
    var id = req.params.id;
    knex('estabelecimentos').where({id: id}).update(req.body).then(function(estabelecimento) {
      res.status(204).json(estabelecimento);
    });
  });

  app.delete('/api/v1/estabelecimentos/:id', auth, function(req, res){
    var id = req.params.id;
    knex('estabelecimentos').where({id: id}).del()
    .then(function(estabelecimento) {
      res.status(204).json();
    });
  });

  /* LISTA OS AGENDAMENTOS DO ESTABELECIMENTO*/
  app.get('/api/v1/estabelecimentos/:id/agendamentos', auth, function(req, res){
    var id_estabelecimento = req.params.id;
    knex.raw("SELECT a.id, s.nome AS servicoNome, a.data AS dataAgendamento, c.nome AS clienteNome, p.nome AS profissionalNome FROM agendamentos a JOIN clientes c ON a.id_cliente = c.id JOIN servicos s ON a.id_servico = s.id JOIN profissionais p ON a.id_profissional = p.id WHERE a.id_estabelecimento = ?", id_estabelecimento)
    .then(function (agendamentos) {
      res.json(agendamentos.rows);
    }).catch(function(err) {
      console.log(err);
    });
  });

  /* LISTA OS PROFISSIONAIS DO ESTABELECIMENTO*/

  app.get('/api/v1/estabelecimentos/:id/profissionais', auth, function(req, res){
    var id_estabelecimento = req.params.id;
    knex.raw("SELECT p.id, p.nome, p.email, p.telefone, p.porcentagem FROM profissionais p JOIN estabelecimentos e ON p.id_estabelecimento = e.id WHERE e.id = ?", id_estabelecimento)
    .then(function (profissionais) {
      res.json(profissionais.rows);
    }).catch(function(err) {
      console.log(err);
    });
  });

  /* LISTA OS AGENDAMENTOS DE UM CLIENTE ESPECÍFICO*/
  app.get('/api/v1/estabelecimentos/:id/agendamentos/clientes/:id_cliente', auth, function(req, res) {
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
  app.get('/api/v1/estabelecimentos/:id/agendamentos/profissionais/:id_profissional', auth, function(req, res) {
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
  app.get('/api/v1/estabelecimentos/:id/agendamentos/servicos/:id_servico', auth, function(req, res) {
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

  app.get('/api/v1/estabelecimentos/:id/clientes/', auth, function(req, res) {
    var id_estabelecimento = req.params.id;
    knex.select('id_cliente').from('agendamentos').where({id_estabelecimento: id_estabelecimento}).then(function (agendamentos) {
      console.log(agendamentos);
      res.json(agendamentos);
    }).catch(function(err) {
      console.log(err);
    });
  });

  /* CRIA UM SERVIÇO RELACIONADO AO ESTABELECIMENTO */
  app.post('/api/v1/estabelecimentos/:id/servicos/:id_servico', auth, function(req, res){
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
}
