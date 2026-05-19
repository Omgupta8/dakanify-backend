const knex = require('../database/index');

const getOrdersByDate = async ( date ) => {
    const stocks = await knex('orders')
        .leftJoin('order_items', 'orders.id', 'order_items.order_id')
        .leftJoin('inventory', 'order_items.inventory_id', 'inventory.id')
        .leftJoin('items', 'inventory.item_id', 'items.id')
        .leftJoin('brands', 'inventory.brand_id', 'brands.id')
        .leftJoin('weights', 'inventory.weight_id', 'weights.id')
        .leftJoin('customers', 'orders.customer_id', 'customers.id')
        .whereRaw('DATE(orders.order_date) = ?', [date])
        .where('orders.is_active', true)
        .orderBy('orders.order_date', 'asc')
        .select(
            // Order
            'orders.id as orderId',
            'orders.order_type as orderType',
            'orders.order_date as orderDate',
            'orders.total_amount as totalAmount',
            'orders.payment_amount as paymentAmount',
            'orders.created_at as createdAt',
            'orders.updated_at as updatedAt',

            // Customer
            'customers.id as customerId',
            'customers.name as customerName',

            // Order Item
            'order_items.id as orderItemId',
            'order_items.quantity',
            'order_items.unit_price as price',
            'order_items.subtotal',

            // Inventory
            'inventory.id as stockId',

            // Item
            'items.id as itemId',
            'items.name as itemName',

            // Brand
            'brands.id as brandId',
            'brands.name as brandName',

            // Weight
            'weights.id as weightId',
            'weights.name as weightName',
        );

    if (!stocks.length) {
        return null;
    }
    const order = {
        orderId: stocks[0].orderId,
        orderType: stocks[0].orderType,
        orderDate: stocks[0].orderDate,
        totalAmount: stocks[0].totalAmount,
        paymentAmount: stocks[0].paymentAmount,
        createdAt: stocks[0].createdAt,
        updatedAt: stocks[0].updatedAt,
        customer: stocks[0].customerId ? {
            customerId : stocks[0].customerId,
            customerName: stocks[0].customerName,
        } : null,
        stocks: stocks.map((stock)=> ({
            orderItemId: stock.orderItemId,
            stockId: stock.stockId,
            quantity: stock.quantity,
            price: stock.price,
            subtotal: stock.subtotal,
            itemId: stock.itemId,
            itemName: stock.itemName,
            brandId: stock.brandId,
            brandName: stock.brandName,
            weightId: stock.weightId,
            weightName: stock.weightName,
        })),
    }
    return order;
};

const createPaymentOrder = async (orderType, orderDate, customerId, paymentAmount) => {
    const [order] = await knex('orders').insert({
        order_type: orderType,
        order_date: orderDate,
        customer_id: customerId,
        payment_amount: paymentAmount, 
    }).returning([
        'id',
        'order_type as orderType',
        'order_date as orderDate',
        'customer_id as customerId',
        'payment_amount as paymentAmount',
        'created_at as createdAt',
        'updated_at as updatedAt',
    ]);

    return order;
};

const createOrderEntry = async (orderType, orderDate, customerId = null, totalAmount, trx) => {
    const [order] = await trx('orders').insert({
        order_type: orderType,
        order_date: orderDate,
        customer_id: customerId,
        total_amount: totalAmount
    }).returning([
        'id',
        'order_type as orderType',
        'order_date as orderDate',
        'customer_id as customerId',
        'total_amount as totalAmount',
        'created_at as createdAt',
        'updated_at as updatedAt',
    ]);
    return order;
};

// select does not work after insert.
const createOrderItemsEntry = async (orderId, stock, trx) => {
    const order = await trx('order_items').insert({
        order_id: orderId,
        inventory_id: stock.stockId,
        quantity: stock.quantity,
        unit_price: stock.price,
        subtotal: stock.subtotal,
    }).returning(['order_id as orderId', 'inventory_id as stockId', 'quantity', 'unit_price as price', 'subtotal']);
    return order;
};

const getOrderById = async (orderId) => {
    const stocks = await knex('orders')
        .leftJoin('order_items', 'orders.id', 'order_items.order_id')
        .leftJoin('inventory', 'order_items.inventory_id', 'inventory.id')
        .leftJoin('items', 'inventory.item_id', 'items.id')
        .leftJoin('brands', 'inventory.brand_id', 'brands.id')
        .leftJoin('weights', 'inventory.weight_id', 'weights.id')
        .leftJoin('customers', 'orders.customer_id', 'customers.id')
        .where('orders.id', orderId)
        .where('orders.is_active', true)
        .select(
            // Order
            'orders.id as orderId',
            'orders.order_type as orderType',
            'orders.order_date as orderDate',
            'orders.total_amount as totalAmount',
            'orders.payment_amount as paymentAmount',
            'orders.created_at as createdAt',
            'orders.updated_at as updatedAt',

            // Customer
            'customers.id as customerId',
            'customers.name as customerName',

            // Order Item
            'order_items.id as orderItemId',
            'order_items.quantity',
            'order_items.unit_price as price',
            'order_items.subtotal',

            // Inventory
            'inventory.id as stockId',

            // Item
            'items.id as itemId',
            'items.name as itemName',

            // Brand
            'brands.id as brandId',
            'brands.name as brandName',

            // Weight
            'weights.id as weightId',
            'weights.name as weightName',
        );

    if (!stocks.length) {
        return null;
    }
    const order = {
        orderId: stocks[0].orderId,
        orderType: stocks[0].orderType,
        orderDate: stocks[0].orderDate,
        totalAmount: stocks[0].totalAmount,
        paymentAmount: stocks[0].paymentAmount,
        createdAt: stocks[0].createdAt,
        updatedAt: stocks[0].updatedAt,
        customer: stocks[0].customerId ? {
            customerId : stocks[0].customerId,
            customerName: stocks[0].customerName,
        } : null,
        stocks: stocks.map((stock)=> ({
            orderItemId: stock.orderItemId,
            stockId: stock.stockId,
            quantity: stock.quantity,
            price: stock.price,
            subtotal: stock.subtotal,
            itemId: stock.itemId,
            itemName: stock.itemName,
            brandId: stock.brandId,
            brandName: stock.brandName,
            weightId: stock.weightId,
            weightName: stock.weightName,
        })),
    }
    return order;
}

const deleteOrderById = async (orderId, trx) => {
    await trx('orders').where('id', orderId).update({
        'is_active': false,
    });
    await trx('order_items').where('order_id', orderId).update({
        'is_active': false,
    });
    return ;
};

module.exports = {
    getOrdersByDate,
    createPaymentOrder,
    createOrderEntry,
    createOrderItemsEntry,
    getOrderById,
    deleteOrderById,
};