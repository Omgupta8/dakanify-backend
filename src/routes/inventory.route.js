const { Router } = require('express');
const { validate } = require('../middlewares/validator.js');
const inventoryValidation = require('../validations/inventory.validation.js');
const invetoryController= require('../controllers/inventory.controller.js');

const router = Router();

router.get('/', validate(inventoryValidation.getStocks), invetoryController.getStocks);

router.post('/', validate(inventoryValidation.createStock), invetoryController.createStock);

router.patch('/:stockId', validate(inventoryValidation.updateStock), invetoryController.updateStock);

router.get('/metadata', invetoryController.getInventoryMetadata);

router.get('/hierarchy', invetoryController.getInventoryHierarchy);

module.exports = router;
