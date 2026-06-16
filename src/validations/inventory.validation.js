const Joi = require('joi');

const getStocks = {
    query: Joi.object().keys({
        search: Joi.string().trim().allow('',null),
        sortBy: Joi.string().valid('item', 'brand', 'weight', 'quantity', 'price'),
        sortOrder: Joi.string().valid('asc', 'desc'),
    })
};

const createStock = {
    body: Joi.object().keys({
        item: Joi.string().trim().required(),
        brand: Joi.string().trim().required(),
        weight: Joi.string().trim().required(),
        quantity: Joi.number().integer().required(),
        price: Joi.number().precision(2).positive().required(),
    })
};

const updateStock = {
    params: Joi.object().keys({
        stockId: Joi.number().integer().positive().required(),
    }),
    body: Joi.object().keys({
        quantity: Joi.number().integer().required(),
        price: Joi.number().precision(2).required(),
    }),
};

module.exports = {
    getStocks,
    createStock,
    updateStock,
};
