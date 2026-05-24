const { Router } = require('express');
const { validate } = require('../middlewares/validator.js');
const inventoryValidation = require('../validations/inventory.validation.js');
const invetoryController= require('../controllers/inventory.controller.js');
const auth = require('../middlewares/auth.js');

const router = Router();

router.get('/',auth, validate(inventoryValidation.getStocks), invetoryController.getStocks);

// TO DO: add transaction
router.post('/',auth, validate(inventoryValidation.createStock), invetoryController.createStock);

router.patch('/:stockId',auth, validate(inventoryValidation.updateStock), invetoryController.updateStock);

router.get('/metadata',auth, invetoryController.getInventoryMetadata);

router.get('/hierarchy',auth, invetoryController.getInventoryHierarchy);

module.exports = router;
