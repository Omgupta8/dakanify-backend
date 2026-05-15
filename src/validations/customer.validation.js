const Joi = require('joi');

const createCustomer = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    mobile: Joi.string().length(10),
});

module.exports = {
    createCustomer
};
