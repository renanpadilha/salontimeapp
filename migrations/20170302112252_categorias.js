exports.up = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('categorias', (table) => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.timestamp('criado_em').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('categorias');
};
