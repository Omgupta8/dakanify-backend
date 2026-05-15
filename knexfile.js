require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PG_DB_HOST,
      port: process.env.PG_DB_PORT,
      database: process.env.PG_DB_NAME,
      user: process.env.PG_DB_USER,
      password: process.env.PG_DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    }
  },
  production: {
    development: {
      client: 'pg',
      connection: {
        host: process.env.PG_DB_HOST,
        port: process.env.PG_DB_PORT,
        database: process.env.PG_DB_NAME,
        user: process.env.PG_DB_USER,
        password: process.env.PG_DB_PASSWORD
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        directory: './src/database/migrations',
      },
      seeds: {
        directory: './src/database/seeds',
      }
    },
  }
};
