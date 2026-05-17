/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema
    .createTable('items', (table) => {
        table.increments('id').primary();
        table.string('name', 100).unique().notNullable();
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
    })
    .createTable('brands', (table) => {
        table.increments('id').primary();
        table.string('name', 100).unique().notNullable();
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
    })
    .createTable('weights', (table) => {
        table.increments('id').primary();
        table.string('name', 10).unique().notNullable();
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
    })
    .createTable('inventory', (table) => {
        table.increments('id').primary();
        table.integer('item_id').unsigned().notNullable();
        table.integer('brand_id').unsigned().notNullable();
        table.integer('weight_id').unsigned().notNullable();
        table.integer('quantity').defaultTo(0);
        table.integer('price').unsigned().defaultTo(0);
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);

        table.foreign('item_id').references('id').inTable('items').onDelete('RESTRICT');
        table.foreign('brand_id').references('id').inTable('brands').onDelete('RESTRICT');
        table.foreign('weight_id').references('id').inTable('weights').onDelete('RESTRICT');
        
        table.unique(['item_id', 'brand_id', 'weight_id']);

        table.index('item_id');
        table.index('brand_id');
        table.index('weight_id');
        table.index('is_active');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
    await knex.schema
    .dropTableIfExists('inventory')
    .dropTableIfExists('weights')
    .dropTableIfExists('brands')
    .dropTableIfExists('items');
};
