/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.createTable('users', (table)=>{
    table.increments('id').primary();
    table.string('username', 50).notNullable();
    table.string('password_hash', 255).notNullable();
    table.timestamps(true, true);

    table.unique('username');
    
    table.index('username');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('users');
};
