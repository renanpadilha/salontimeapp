exports.up = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('estabelecimentos', (table) => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('email').unique().notNullable();
    table.string('endereco').notNullable();
    table.string('telefone').notNullable();
    table.integer('id_usuario').references('usuarios.id');
    table.decimal('rate');
    table.timestamp('criado_em').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('estabelecimentos');
};
