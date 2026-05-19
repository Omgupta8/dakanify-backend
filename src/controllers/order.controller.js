const { status: httpStatus, default: status } = require('http-status');
const orderService = require('../services/order.service');

const getOrders = async (req, res, next) => {
    try{
        const { date } = req.query;
        const orders = await orderService.getOrders(date);
        return res.status(httpStatus.OK).json({
            status: true, 
            orders
        });
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: false,
            message: err.message,
        });
    }
};

const createOrder = async (req, res, next) => {
    try{
        const { orderType, orderDate, customerId, paymentAmount, stocks } = req.body;
        const result = await orderService.createOrder(orderType, orderDate, customerId, paymentAmount, stocks);
        return res.status(httpStatus.CREATED).json({
            status: true, 
            result,
        });
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: false,
            message: err.message,
        });
    }
};

const updateOrder = async (req, res, next) => {
    try{
        const { orderId } = req.params;
        const { orderType, orderDate, customerId, paymentAmount, stocks } = req.body;
        const result = await orderService.updateOrder(orderId, orderType, orderDate, customerId, paymentAmount, stocks);
        return res.status(httpStatus.OK).json({
            status: true, 
            result,
        });
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: false,
            message: err.message,
        })
    }
};

module.exports = {
    getOrders,
    createOrder,
    updateOrder,
};