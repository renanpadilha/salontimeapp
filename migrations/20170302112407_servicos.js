exports.up = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('servicos', (table) => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.integer('duracao').notNullable();
    table.integer('id_categoria').references('categorias.id');
    table.timestamp('criado_em').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('servicos');
};
