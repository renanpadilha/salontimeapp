module.exports = function(app, auth) {
  var knex = require('../db');
  app.get('/api/v1/profissionais/', auth, function(req, res){
    knex.select("*").from('profissional').then(function(profissional) {
      res.json(profissional);
    });
  });

  app.get('/api/v1/profissionais/:id', auth, function(req, res, next) {
    var id = req.params.id;
    knex.select("*").from('profissional').where({id: id}).then(function(profissional) {
      res.json(profissional);
    });
  });

  app.post('/api/v1/profissionais', auth, function(req, res){
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

  app.put('/api/v1/profissionais/:id', auth, function(req, res){
    var id = req.params.id;
    knex('profissional').where({id: id}).update(req.body).then(function(profissional) {
      res.status(204).json(profissional);
    });
  });

  app.delete('/api/v1/profissionais/:id', auth, function(req, res){
    var id = req.params.id;
    knex('profissional').where({id: id}).del().then(function(profissional) {
      res.status(204).json();
    });
  });

  /* ASSOCIA UM PROFISSIONAL A UM SERVIÇO */
  app.post('/api/v1/profissionais/:id/servicos', auth, function(req, res){
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
}
