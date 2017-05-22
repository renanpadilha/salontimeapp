
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('favoritos', (table) => {
    table.increments('id').primary();
    table.integer('id_cliente').references('clientes.id');
    table.integer('id_estabelecimento').references('estabelecimentos.id');
    table.boolean('favorito').notNullable().defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('favoritos');
};
