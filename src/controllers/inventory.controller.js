const { status: httpStatus } = require('http-status');
const inventoryService = require('../services/inventory.service');

const getStocks = async (req, res, next) => {
    try {
        const { search, sortBy, sortOrder } = req.query;
        const result = await inventoryService.getStocks(search, sortBy, sortOrder);
        return res.status(httpStatus.OK).json({
            status: true, 
            result,
        })
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: false,
            message: err.message,
        });
    }
}

const getInventoryMetadata = async (req, res, next) => {
    try{
        const result = await inventoryService.getInventoryMetadata();
        const newResult = {};
        for(const [key, value] of Object.entries(result)) {
            newResult[key] = value.map((x) => ({
                id: x.id, 
                name: x.name
            }));
        };
        return res.status(httpStatus.OK).json({
            status: true,
            newResult,
        });
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: false,
            message: err.message,
        });
    }
};

const createStock = async (req, res, next) => {
    try {
        const { item, brand, weight, quantity, price } = req.body;
        const result = await inventoryService.createStock(item, brand, weight, quantity, price);
        return res.status(httpStatus.CREATED).json({
            status: true, 
            result,
        });
    } catch (err) {
        res.status(httpStatus.BAD_REQUEST).json({
            status: false,
            message: err.message,
        });
    }
};

const updateStock = async (req, res, next) => {
    try {
        const { stockId } = req.params;
        const { quantity, price } = req.body;
        const result = await inventoryService.updateStock(stockId, quantity, price);
        return res.status(httpStatus.OK).json({
            status: true, 
            result,
        });
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: false,
            message: err.message,
        });
    }
};

const getInventoryHierarchy = async (req, res, next) => {
    try {
        const hierarchy = await inventoryService.getInventoryHierarchy();
        return res.status(httpStatus.OK).json({
           status: true, 
           hierarchy, 
        });
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: false,
            message: err.message,
        });
    }
};

module.exports = {
    getStocks,
    getInventoryMetadata,
    createStock,
    updateStock,
    getInventoryHierarchy,
};
