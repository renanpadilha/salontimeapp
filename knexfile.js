module.exports = {
  development: {
    client: 'pg',
    debug: true,
    connection: {
      // debug: true,
      pool: {max: 1, min: 1},
      host : 'localhost',
      port: 5432,
      user : 'postgres',
      database : 'salontime',
      password : 'renancio123'
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  production: {
    client: 'pg',
    connection: {
      // debug: true,
      pool: {max: 1, min: 1},
      host : 'ec2-54-235-177-62.compute-1.amazonaws.com',
      port: 5432,
      user : 'asjofobobcqtsm',
      database : 'd6pje4mqqq69d2',
      password : 'aLdrhhmSzZxOYmCYIG4i_pyxKy',
      ssl: true
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
