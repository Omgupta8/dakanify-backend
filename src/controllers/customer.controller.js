const { status: httpStatus } = require('http-status');
const customerService = require('../services/customer.service.js');

const getCustomers = async (req, res, next) => {
    try {
        const { search , sortBy, sortOrder } = req.query;
        const result = await customerService.getCustomers(search, sortBy, sortOrder);
        return res.status(httpStatus.OK).json({
            status: true,
            result,
        });
    } catch (err) {
        res.status(httpStatus.BAD_REQUEST).json({
            status: false,
            message: err.message,
        });
    }
}

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

const updateCustomer = async (req, res, next) => {
    try{
        const { customerId } = req.params;
        const { name, mobile } = req.body;
    const result = await customerService.updateCustomer(customerId, name, mobile);
        return res.status(httpStatus.OK).json({
            status: true,
            result,
        });
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: false, 
            message: err.message,
        });
    }
}

const getCustomerProfile = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        const result = await customerService.getCustomerProfile(customerId);
        return res.status(httpStatus.OK).json({
            status: true,
            result
        });
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: false,
            message: err.message,
        });
    }
}

const getCustomerDashboard = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        const customerProfile = await customerService.getCustomerProfile(customerId);
        const orders = await customerService.getCustomerOrders(customerId);
        return res.status(httpStatus.OK).json({
            status: true,
            customerProfile,
            orders,
        });
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: false,
            message: err.message,
        });
    }
};

module.exports = {
    getCustomers,
    createCustomer,
    updateCustomer,
    getCustomerProfile,
    getCustomerDashboard,
};
