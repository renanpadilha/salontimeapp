module.exports = function(app) {
  var knex = require('../db');
  app.get('/api/v1/categorias/', function(req, res){
    knex.select("*").from('categorias').then(function(categorias) {
      res.json(categorias);
    });
  });

  app.get('/api/v1/categorias/:id', function(req, res, next) {
    var id = req.params.id;
    knex.select("*").from('categorias').where({id: id}).then(function(categoria) {
      res.json(categoria);
    });
  });

  app.post('/api/v1/categorias', function(req, res){
    var categoria = {
      nome: req.body.nome
    };
    knex.insert(categoria).into('servicos').then(function(categoria) {
      res.status(201).json(categoria);
    });
  });

  app.put('/api/v1/categorias/:id', function(req, res){
    var id = req.params.id;
    knex('categorias').where({id: id}).update(req.body).then(function(categoria) {
      res.status(204).json(categoria);
    });
  });

  app.delete('/api/v1/categorias/:id', function(req, res){
    var id = req.params.id;
    knex('categorias').where({id: id}).del().then(function(categoria) {
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
}
