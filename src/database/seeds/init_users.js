const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('users').truncate();

  const hashedPassword = await bcrypt.hash('Test@123', saltRounds);
  await knex('users').insert([
    {username: 'admin', password_hash: hashedPassword}
  ]);
};
