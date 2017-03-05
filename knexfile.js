const databaseName = 'salontime';

module.exports = {
  development: {
    client: 'pg',
    connection: `postgres://postgres:renancio123@localhost:5432/${databaseName}`,
    migrations: {
      directory: './migrations'
    }
  },
  production: {
    client: 'pg',
    connection: 'postgres://asjofobobcqtsm:aLdrhhmSzZxOYmCYIG4i_pyxKy@ec2-54-235-177-62.compute-1.amazonaws.com:5432/d6pje4mqqq69d2',
    migrations: {
      tableName: 'knex_migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
