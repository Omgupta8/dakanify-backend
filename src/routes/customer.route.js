const { Router } = require('express');
const { validate } = require('../middlewares/validator.js');
const customerValidation = require('../validations/customer.validation.js');
const customerController = require('../controllers/customer.controller.js');

const router = Router();

router.get('/', validate(customerValidation.getCustomers), customerController.getCustomers);

router.post('/', validate(customerValidation.createCustomer) , customerController.createCustomer);

router.get('/:userId', validate(customerValidation.getCustomerProfile), customerController.getCustomerProfile);

module.exports = router;