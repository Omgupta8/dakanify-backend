const Joi = require('joi');

const registerUser = {
    body: Joi.object().keys({
        username: Joi.string().trim().min(1).max(50).required(),
        password: Joi.string().required(),
    })
}

const loginUser = {
    body: Joi.object().keys({
        username: Joi.string().trim().min(1).max(50).required(),
        password: Joi.string().required(),
    }).required(),
};

const updatePassword = {
    body: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
    })
};

module.exports = {
    registerUser,
    loginUser,
    updatePassword,
};