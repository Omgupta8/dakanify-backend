
const knex = require('knex');
const env = process.env.NODE_ENV || development;
const knexConfig = require('../../knexfile.js');

const config = knexConfig[env];

module.exports = knex(config);