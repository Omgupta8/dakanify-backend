const knex = require('../database/index');

const getUserByUsername = async (username) => {
    const user = await knex('users').where('username', username).first();
    return user || null;
};

const getUserByUserId = async (userId) => {
    const user = await knex('users').where('id', userId).first();
    return user || null;
};

const createUser = async (username, passwordHash) => {
    const [user] = await knex('users')
        .insert({
            username,
            password_hash: passwordHash,
        })
        .returning(['id', 'username']);
    return user;
};

const updateUserPassword = async (userId, passwordHash) => {
    const [user] = await knex('users')
        .where('id', userId)
        .update({ password_hash: passwordHash })
        .returning(['id', 'username']);
    return user;
};

module.exports = {
    getUserByUsername,
    getUserByUserId,
    createUser,
    updateUserPassword,
};