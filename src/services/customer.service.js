const customerModel = require('../models/customer.model.js');
const orderModel = require('../models/order.model.js');

const getCustomers = async (search = '', sortBy = 'created_at', sortOrder = 'desc') => {
    const customers = await customerModel.getCustomers(search , sortBy, sortOrder);
    return customers;
};

const createCustomer = async (name , mobile = null) => {
    const customer = await customerModel.getCustomerByName(name);
    if(customer) {
        throw new Error('Customer Already Exists');
    }
    await customerModel.createCustomer(name, mobile);
    return 'Customer Created';
};

const updateCustomer = async ( customerId, name, mobile = null ) => {
    const customer = await customerModel.getCustomerById(customerId);
    if(!customer) {
        throw new Error('Customer does not exists');
    }
    const newCustomerName = await customerModel.getCustomerByName(name);
    if(customer.name != name && newCustomerName) throw new Error('Customer name already exists');
    const updatedCustomer = await customerModel.updateCustomer(customerId, name, mobile);
    return updatedCustomer;
};

const getCustomerProfile = async ( customerId ) => {
    const customer = await customerModel.getCustomerById(customerId);
    if(!customer) {
        throw new Error('Customer does not exists');
    }
    return customer;
};

const getCustomerOrders = async (customerId) => {
    const orders = await orderModel.getOrdersByCustomer(customerId);
    const paymentReceived = [];
    const borrowing = {};
    let totalPending = 0, totalPaid = 0, cumulativePending = 0;
    for ( const order of orders ) {
        if (order.orderType === 'payment_received') {
            const paymentAmount = parseFloat(order.paymentAmount) || 0;
            paymentReceived.push({
                orderId: order.orderId,
                orderType: order.orderType,
                orderDate: order.orderDate,
                paymentAmount,
            });
            totalPaid += paymentAmount;
        } else if (order.orderType === 'borrowing') {
            const totalAmount = parseFloat(order.totalAmount) || 0;

            if (!borrowing[order.orderId]) {
                borrowing[order.orderId] = {
                    orderId: order.orderId,
                    orderType: order.orderType,
                    orderDate: order.orderDate,
                    totalAmount,
                    cumulativePending: 0,
                    isPaid: true,
                    stocks: [],
                };
                totalPending += totalAmount;
            }

            borrowing[order.orderId].stocks.push({
                orderItemId: order.orderItemId,
                quantity: order.quantity,
                subtotal: order.subtotal,
                price: order.price,
                stockId: order.stockId,
                itemId: order.itemId,
                itemName: order.itemName,
                brandId: order.brandId,
                brandName: order.brandName,
                weightId: order.weightId,
                weightName: order.weightName,
            });
        } else {
            throw new Error('Order Type incorrect');
        }
    }
    cumulativePending = totalPending - totalPaid;
    if (totalPaid < totalPending) {
        for( const order of Object.values(borrowing)) {
            if(cumulativePending <= 0) break;
            order.cumulativePending = cumulativePending;
            order.isPaid = false;
            cumulativePending = cumulativePending - order.totalAmount;
        }
    }

    return {
        paymentReceived,
        borrowing: Object.values(borrowing),
        pending: totalPending - totalPaid,
    };
};

module.exports = { 
    getCustomers,
    createCustomer,
    updateCustomer,
    getCustomerProfile,
    getCustomerOrders,
};
