const Joi = require('joi');

// TO DO - deafult is not working currently.
const getCustomers = {
    query: Joi.object().keys({
        search: Joi.string().trim().allow('',null),
        sortBy: Joi.string().valid('name', 'mobile', 'balance', 'created_at').default('created_at'),
        sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    })
};

const createCustomer = {
    body: Joi.object().keys({
        name: Joi.string().trim().min(1).max(100).required(),
        mobile: Joi.string().length(10),
    }),
};

const getCustomerProfile = {
    params: Joi.object().keys({
        customerId: Joi.number().integer().positive().required(),
    }),
};

module.exports = {
    getCustomers,
    createCustomer,
    getCustomerProfile,
};
