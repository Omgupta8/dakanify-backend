const { Router } = require('express');

const router = Router();

const customerRoute = require('./customer.route');
const inventoryRoute = require('./inventory.route');
const orderRoute = require('./order.route');

router.use('/customers', customerRoute);
router.use('/inventory', inventoryRoute);
router.use('/orders', orderRoute);

module.exports = router;