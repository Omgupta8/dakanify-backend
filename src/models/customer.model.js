const knex = require('../database/index.js'); 
const Customer = require('../database/models/Customer.js');

const getCustomerByName = async (name) => {
    const customer = await knex('customers').where('name', name).first();
    return customer || null;
};

const createCustomer = async (name, mobile) => {
    const customer = await knex('customers').insert({
        name,
        mobile,
    }).select(name, mobile);
    return customer;
};

const getCustomerById = async (customerId) => {
    // first() return undefined or value
    // select() returns an array
    const customer = await knex('customers').where('id', customerId).first();
    return customer || null;
};

const updateCustomer = async (customerId, name, mobile) => {
    const [customer] = await knex('customers').where('id', customerId).update({
        name,
        mobile,
    }).returning('*');
    return customer;
};

// Example for query builder
const getCustomers = async (search, sortBy, sortOrder) => {
    const query = knex('customers');
    if(search) query.whereILike('name' , `%${search}%`).orWhereILike('mobile', `%${search}%`);
    query.orderBy(sortBy, sortOrder);
    await query.select('*');
    return query;
};

module.exports = {
    getCustomerByName,
    createCustomer,
    updateCustomer,
    getCustomerById,
    getCustomers,
};