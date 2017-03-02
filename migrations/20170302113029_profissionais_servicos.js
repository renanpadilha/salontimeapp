exports.up = (knex, Promise) => {
  return knex.schema.createTable('profissionais_servicos', (table) => {
    table.increments('id').primary();
    table.integer('id_profissional').references('profissionais.id');
    table.integer('id_servico').references('servicos.id');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('profissionais_servicos');
};
