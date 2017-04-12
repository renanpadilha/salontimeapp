
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('blacklist', (table) => {
    table.increments('id').primary();
    table.integer('id_cliente').references('clientes.id');
    table.integer('id_estabelecimento').references('estabelecimentos.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('usuarios');
};
