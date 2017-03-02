exports.up = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('estabelecimentos_servicos', (table) => {
    table.increments('id').primary();
    table.decimal('preco').notNullable();
    table.integer('id_estabelecimento').references('estabelecimentos.id');
    table.integer('id_servico').references('servicos.id');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('estabelecimentos_servicos');
};
