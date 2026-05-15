/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.createTable('customers', (table) => {
    table.increments('id');
    table.string('name', 100);
    table.string('mobile', 10);
    table.timestamps(true, true);

    table.index(['name'], 'idx_name');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.schema.table('customers', (table) => {
    table.dropIndex('idx_name');
  })
  .dropTable('customers');
};
