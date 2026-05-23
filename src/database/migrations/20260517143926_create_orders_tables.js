/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema
    .createTable('orders', (table) => {
      table.increments('id').primary();
      table.integer('customer_id').nullable();
      table.enum('order_type', ['instant_payment', 'borrowing', 'payment_received']).notNullable();
      table.integer('total_amount').nullable();
      table.integer('payment_amount').nullable();
      table.dateTime('order_date').notNullable();
      table.boolean('is_active').notNullable().defaultTo(true);
      table.timestamps(true, true);

      table.foreign('customer_id').references('id').inTable('customers').onDelete('RESTRICT');

      table.index('customer_id');
      table.index('order_date');
      table.index('order_type');
      table.index('is_active');
      table.index(['customer_id', 'order_date']);
      table.index(['customer_id', 'total_amount']);
      table.index(['customer_id', 'payment_amount']);
    })
    .createTable('order_items', (table) => {
      table.increments('id').primary();
      table.integer('order_id').notNullable();
      table.integer('inventory_id').notNullable();
      table.integer('quantity').notNullable();
      table.integer('unit_price').notNullable();
      table.integer('subtotal').notNullable();
      table.boolean('is_active').notNullable().defaultTo(true);

      table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');
      table.foreign('inventory_id').references('id').inTable('inventory').onDelete('RESTRICT');

      table.index('order_id');
      table.index('inventory_id');
      table.index('is_active');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('order_items').dropTableIfExists('orders');
};
