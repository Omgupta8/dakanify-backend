const { Router } = require('express');
const { validate } = require('../middlewares/validator.js');
const orderValidation = require('../validations/order.validation.js');
const orderController = require('../controllers/order.controller.js');

const router = Router();

// router.get('/', validate(orderValidation.getOrders), orderController.getOrders);

router.post('/', validate(orderValidation.createOrder), orderController.createOrder);

router.put('/:orderId', validate(orderValidation.updateOrder), orderController.updateOrder);

module.exports = router;