/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.createTable('customers', (table) => {
    table.increments('id').primary();
    table.string('name', 100);
    table.string('mobile', 10);
    table.string('balance', 10).defaultTo('0');
    table.timestamps(true, true);

    table.index(['name'], 'idx_name');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('customers');
};
