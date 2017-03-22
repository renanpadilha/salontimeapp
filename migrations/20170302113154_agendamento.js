exports.up = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('agendamentos', (table) => {
    table.increments('id').primary();
    table.timestamp('data').notNullable();
    table.integer('id_estabelecimento').references('estabelecimentos.id');
    table.integer('id_cliente').references('clientes.id');
    table.integer('id_profissional').references('profissionais.id');
    table.integer('id_servico').references('servicos.id');
    table.decimal('rate');
    table.boolean('atendido').notNullable().defaultTo(false);
    table.timestamp('criado_em').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('agendamentos');
};
