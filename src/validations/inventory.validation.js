const Joi = require('joi');

const getStocks = {
    query: Joi.object({
        search: Joi.string().allow('',null),
        sortyBy: Joi.string().valid('item', 'brand', 'weight', 'quantity', 'price'),
        sortOrder: Joi.string().valid('asc', 'desc'),
    })
};

const createStock = {
    body: Joi.object({
        item: Joi.string().required(),
        brand: Joi.string().required(),
        weight: Joi.string().required(),
        quantity: Joi.number().integer().required(),
        price: Joi.number().integer().positive().required(),
    })
};

const updateStock = {
    params: Joi.object({
        stockId: Joi.string().required(),
    }),
    body: Joi.object({
        quantity: Joi.number().integer().required(),
        price: Joi.number().integer().required(),
    }),
};

module.exports = {
    getStocks,
    createStock,
    updateStock,
};
