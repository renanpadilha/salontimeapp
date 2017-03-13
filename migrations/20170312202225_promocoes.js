
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('promocoes', (table) => {
    table.increments('id').primary();
    table.integer('id_estabelecimento').references('estabelecimentos.id');
    table.integer('id_servico').references('servicos.id');
    table.decimal('preco').notNullable();
    table.timestamp('criado_em').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('promocoes');
};
