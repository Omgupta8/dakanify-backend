const knex = require('../database/index.js'); 
const Customer = require('../database/models/Customer.js');

const getCustomerByName = async (name) => {
    const customer = await knex('customers').where('name', name).first();
    if(customer) return customer;
    else return null;
};

const createCustomer = async (name, mobile) => {
    const customer = await knex('customers').insert({
        name,
        mobile,
    }).select(name, mobile);
    return customer;
};

module.exports = {
    getCustomerByName,
    createCustomer,
};