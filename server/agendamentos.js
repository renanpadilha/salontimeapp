module.exports = function(app) {
  var knex = require('../db');
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
}
