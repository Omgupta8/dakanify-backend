const Joi = require('joi');

const getOrders = {
    query: Joi.object().keys({
        date: Joi.date().iso().required(),
    }),
};

const createOrder = {
    body: Joi.object().keys({
        orderType: Joi.string().valid('payment_received', 'instant_payment', 'borrowing').required(),
        orderDate: Joi.date().iso().required(),
        customerId: Joi.number().integer().positive().when('orderType', {
            is: Joi.valid('payment_received', 'borrowing'),
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        }),
        paymentAmount: Joi.number().integer().positive().when('orderType', {
            is: 'payment_received',
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        }),
        stocks: Joi.array().items(
            Joi.object().keys({
                stockId: Joi.number().integer().positive().required(),
                quantity: Joi.number().integer().required(),
                price: Joi.number().integer().required(),
            }),
        ).min(1).when('orderType', {
            is: Joi.valid('borrowing', 'instant_payment'),
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        }),
    }).custom((value, helpers) => {

        if(value.stocks?.length) {
            const stockIds = new Set();
            for( const stock of value.stocks) {
                if (stockIds.has(stock.stockId)) {
                    return helpers.message(
                        'Duplicate stockId is not allowed'
                    );
                }
                stockIds.add(stock.stockId);
            }
        }

        return value;
    }),
};

const updateOrder = {
    params: Joi.object().keys({
        orderId: Joi.number().integer().positive().required(),
    }),
    body: Joi.object().keys({
        orderType: Joi.string().valid('payment_received', 'instant_payment', 'borrowing').required(),
        orderDate: Joi.date().iso().required(),
        customerId: Joi.number().integer().positive().when('orderType', {
            is: Joi.valid('payment_received', 'borrowing'),
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        }),
        paymentAmount: Joi.number().integer().positive().when('orderType', {
            is: 'payment_received',
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        }),
        stocks: Joi.array().items(
            Joi.object().keys({
                stockId: Joi.number().integer().positive().required(),
                quantity: Joi.number().integer().required(),
                price: Joi.number().integer().required(),
            }),
        ).min(1).when('orderType', {
            is: Joi.valid('borrowing', 'instant_payment'),
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        }),
    }),
};

module.exports = {
    getOrders,
    createOrder,
    updateOrder,
}