var knexfile = require('./knexfile.js');
var knex = require('knex')(knexfile.production);

module.exports = knex;
