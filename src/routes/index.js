const { Router } = require('express');

const router = Router();

const customerRoute = require('./customer.route');
const inventoryRoute = require('./inventory.route');

router.use('/customers', customerRoute);
router.use('/inventory', inventoryRoute);

module.exports = router;