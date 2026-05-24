const knex = require('../database/index');
const orderModel = require('../models/order.model');
const customerModel = require('../models/customer.model');
const inventoryModel = require('../models/inventory.model');

const getOrders = async ( date ) => {
    const orders = await orderModel.getOrdersByDate(date);
    const paymentReceived = [];
    const borrowing = {};
    const instantPayment = {};
    for ( const order of orders ) {
        if (order.orderType === 'payment_received') {
            paymentReceived.push({
                orderId: order.orderId,
                orderType: order.orderType,
                orderDate: order.orderDate,
                paymentAmount: order.paymentAmount,
                customerId: order.customerId,
                customerName: order.customerName
            });
        } else if (order.orderType === 'borrowing') {

            if (!borrowing[order.orderId]) {
                borrowing[order.orderId] = {
                    orderId: order.orderId,
                    orderType: order.orderType,
                    orderDate: order.orderDate,
                    totalAmount: order.totalAmount,
                    customerId: order.customerId,
                    customerName: order.customerName,
                    stocks: [],
                };
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
        } else if (order.orderType === 'instant_payment') {
            if (!instantPayment[order.orderId]) {
                instantPayment[order.orderId] = {
                    orderId: order.orderId,
                    orderType: order.orderType,
                    orderDate: order.orderDate,
                    totalAmount: order.totalAmount,
                    stocks: [],
                };
            }
            instantPayment[order.orderId].stocks.push({
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
    return {
        paymentReceived,
        instantPayment: Object.values(instantPayment),
        borrowing: Object.values(borrowing)
    };
};

const createStockEntry = async (orderType, orderDate, customerId, stocks, trx = knex) => {
    let totalAmount = 0;
    const stockList = [];
    for (const stock of stocks ) {
        const existingStock = await inventoryModel.getStockById(stock.stockId, trx);
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
    const customer = await customerModel.getCustomerById(customerId, trx);
    if(!customer) throw new Error('Customer not found');
    const result = await orderModel.createPaymentOrder(orderType, orderDate, customerId, paymentAmount, trx);
    return result;
};

const createBorrowingOrder = async (orderType, orderDate, customerId, stocks, trx = knex) => {
    const customer = await customerModel.getCustomerById(customerId, trx);
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
        await trx.commit();
        return updatedOrder;
    } catch (err) {
        await trx.rollback();
        throw err;
    }
};

module.exports = {
    getOrders,
    createOrder,
    updateOrder,
};
