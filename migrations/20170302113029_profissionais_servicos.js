exports.up = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('profissionais_servicos', (table) => {
    table.increments('id').primary();
    table.integer('id_profissional').references('profissionais.id');
    table.integer('id_servico').references('servicos.id');
    table.integer('id_estabelecimento').references('estabelecimentos.id');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('profissionais_servicos');
};
