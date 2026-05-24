const { Router } = require('express');
const { validate } = require('../middlewares/validator.js');
const customerValidation = require('../validations/customer.validation.js');
const customerController = require('../controllers/customer.controller.js');
const auth = require('../middlewares/auth.js');

const router = Router();

router.get('/', auth, validate(customerValidation.getCustomers), customerController.getCustomers);

router.post('/', auth, validate(customerValidation.createCustomer) , customerController.createCustomer);

router.put('/:customerId',auth, validate(customerValidation.updateCustomer), customerController.updateCustomer);

router.get('/:customerId',auth, validate(customerValidation.getCustomerProfile), customerController.getCustomerProfile);

router.get('/:customerId/dashboard',auth, validate(customerValidation.getCustomerDashboard), customerController.getCustomerDashboard);

module.exports = router;