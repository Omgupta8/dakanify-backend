const { Router } = require('express');

const router = Router();

const customerRoute = require('./customer.route');

router.use('/customers', customerRoute);

module.exports = router;