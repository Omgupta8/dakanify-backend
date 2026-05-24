const { Router } = require('express');
const { validate } = require('../middlewares/validator.js');
const orderValidation = require('../validations/order.validation.js');
const orderController = require('../controllers/order.controller.js');
const auth = require('../middlewares/auth.js');

const router = Router();

router.get('/',auth, validate(orderValidation.getOrders), orderController.getOrders);

router.post('/',auth, validate(orderValidation.createOrder), orderController.createOrder);

router.put('/:orderId',auth, validate(orderValidation.updateOrder), orderController.updateOrder);

module.exports = router;