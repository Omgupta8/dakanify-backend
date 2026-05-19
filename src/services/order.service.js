const knex = require('../database/index');
const orderModel = require('../models/order.model');
const customerModel = require('../models/customer.model');
const inventoryModel = require('../models/inventory.model');

const getOrders = async ( date ) => {
    const orders = await orderModel.getOrdersByDate(date);
    return orders;
};

const createStockEntry = async (orderType, orderDate, customerId, stocks, trx = knex) => {
    let totalAmount = 0;
    const stockList = [];
    for (const stock of stocks ) {
        const existingStock = await inventoryModel.getStockById(stock.stockId);
        if(!existingStock) throw new Error('Stock not found');
        if(existingStock.quantity < stock.quantity) throw new Error(`Max Quantity present in [${existingStock.item}, ${existingStock.brand}, ${existingStock.weight}]  is ${existingStock.quantity}.`);
        const subtotal = stock.price * stock.quantity;
        totalAmount += subtotal;
        stockList.push({
            ...stock,
            subtotal
        });
    }
    const order = await orderModel.createOrderEntry(orderType, orderDate, customerId, totalAmount, trx);
    for (const stock of stockList) {
        await orderModel.createOrderItemsEntry(order.id, stock, trx);
        await inventoryModel.reduceStockById(stock.stockId, stock.quantity, trx);
    }
    return { order, stockList };
};

// NOTE: reorder orders and dashboard on the basis of order_date and in desc order
const createPaymentReceivedOrder = async (orderType, orderDate, customerId, paymentAmount, trx = knex) => {
    const customer = await customerModel.getCustomerById(customerId);
    if(!customer) throw new Error('Customer not found');
    const result = await orderModel.createPaymentOrder(orderType, orderDate, customerId, paymentAmount, trx);
    return result;
};

const createBorrowingOrder = async (orderType, orderDate, customerId, stocks, trx = knex) => {
    const customer = await customerModel.getCustomerById(customerId);
    if(!customer) throw new Error('Customer not found');
    const result = await createStockEntry(orderType, orderDate, customerId, stocks, trx);
    return result;
};

// TO DO: make the optimisations later
// TO DO: also fix error message 
const createInstantPaymentOrder = async (orderType, orderDate, stocks, trx = knex) => {
    const result = await createStockEntry (orderType, orderDate, null, stocks, trx);
    return result;
};

const createOrder = async (orderType, orderDate, customerId, paymentAmount, stocks) => {
    const trx = await knex.transaction();
    try{
        let result;
        if(orderType === 'payment_received') result = await createPaymentReceivedOrder(orderType, orderDate, customerId, paymentAmount, trx);
        else if (orderType === 'borrowing') result = await createBorrowingOrder(orderType, orderDate, customerId, stocks, trx);
        else if (orderType === 'instant_payment') result = await createInstantPaymentOrder(orderType, orderDate, stocks, trx);
        else throw new Error('Invalid Order Type');
        await trx.commit();
        return result;
    } catch (err) {
        await trx.rollback();
        throw err;
    }
    
};

const updateOrder = async (orderId, orderType, orderDate, customerId, paymentAmount, stocks) => {
    const existingOrder = await orderModel.getOrderById(orderId);
    if(!existingOrder) throw new Error('Order is not active or does not exist');
    const trx = await knex.transaction();
    try{
        if(existingOrder.orderType === 'borrowing' || existingOrder.orderType === 'instant_payment') {
            for ( const stock of existingOrder.stocks ){
                await inventoryModel.increaseStockById(stock.stockId, stock.quantity, trx);
            }
        }
        await orderModel.deleteOrderById(orderId, trx);
        let updatedOrder;
        if(orderType === 'payment_received') updatedOrder = await createPaymentReceivedOrder(orderType, orderDate, customerId, paymentAmount, trx);
        else if (orderType === 'borrowing') updatedOrder = await createBorrowingOrder(orderType, orderDate, customerId, stocks, trx);
        else if (orderType === 'instant_payment') updatedOrder = await createInstantPaymentOrder(orderType, orderDate, stocks, trx);
        else throw new Error('Invalid Order Type');
        trx.commit();
        return updatedOrder;
    } catch (err) {
        trx.rollback();
        throw err;
    }
};

module.exports = {
    getOrders,
    createOrder,
    updateOrder,
};
