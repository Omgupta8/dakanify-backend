const { status: httpStatus } = require('http-status');
const customerService = require('../services/customer.service.js');

const createCustomer = async (req, res, next) => {
    try {
        const { name , mobile } = req.body;
        const result = await customerService.createCustomer(name, mobile);
        return res.sendStatus(httpStatus.CREATED);
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: false,
            message: err.message,
        });
    }
};

module.exports = {
    createCustomer
};
