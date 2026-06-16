/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async(knex) => {
  await knex.schema.alterTable('customers', (table)=> {
    table.decimal('balance', 15, 2).defaultTo(0).alter();
  });

  await knex.schema.alterTable('inventory', (table)=> {
    table.decimal('price', 15, 2).unsigned().defaultTo(0).alter();
  });

  await knex.schema.alterTable('orders', (table) => {
    table.decimal('total_amount', 15, 2).nullable().alter();
    table.decimal('payment_amount', 15, 2).nullable().alter();
  }).alterTable('order_items', (table) => {
    table.decimal('unit_price', 15, 2).notNullable().alter();
    table.decimal('subtotal', 15, 2).notNullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async(knex) => {
  await knex.schema.alterTable('customers', (table)=> {
    table.integer('balance').defaultTo(0).alter();
  });

  await knex.schema.alterTable('inventory', (table)=> {
    table.integer('price').unsigned().defaultTo(0).alter();
  });
  
  await knex.schema.alterTable('orders', (table) => {
    table.integer('total_amount').nullable().alter();
    table.integer('payment_amount').nullable().alter();
  }).alterTable('order_items', (table) => {
    table.integer('unit_price').notNullable().alter();
    table.integer('subtotal').notNullable().alter();
  });
};
