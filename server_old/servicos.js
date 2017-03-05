module.exports = function(app, auth) {
  var knex = require('../db');
  app.get('/api/v1/servicos/', function(req, res){
    knex.select("*").from('servicos').then(function(servicos) {
      res.json(servicos);
    });
  });

  app.get('/api/v1/servicos/:id', auth, function(req, res, next) {
    var id = req.params.id;
    knex.select("*").from('servicos').where({id: id}).then(function(servico) {
      res.json(servico);
    });
  });

  app.post('/api/v1/servicos', auth, function(req, res){
    var servico = {
      nome: req.body.nome
    };
    knex.insert(servico).into('servicos').then(function(servico) {
      res.status(201).json(servico);
    });
  });

  app.put('/api/v1/servicos/:id', auth, function(req, res){
    var id = req.params.id;
    knex('servicos').where({id: id}).update(req.body).then(function(servico) {
      res.status(204).json(servico);
    });
  });

  app.delete('/api/v1/servicos/:id', auth, function(req, res){
    var id = req.params.id;
    knex('servicos').where({id: id}).del().then(function(servico) {
      res.status(204).json();
    });
  });

  /* LISTA TODOS OS ESTABELECIMENTOS QUE POSSUEM UM SERVIÇO PRIMÁRIO ESPECÍFICO */
  app.get('/api/v1/servicos/:id/estabelecimentos', function(req, res){
    var id = req.params.id;
    knex.raw('SELECT e.id, e.nome, e.endereco, es.id_servico FROM  estabelecimentos e JOIN estabelecimentos_servicos es ON es.id_estabelecimento = e.id WHERE es.id_servico = ? GROUP BY e.id, e.nome, e.endereco, es.id_servico', id)
    .then(function(id){
      console.log(id);
      res.json(id.rows);
    }).catch(function(err) {
      console.log(err);
    });
  });
}
