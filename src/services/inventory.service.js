const inventoryModel = require('../models/inventory.model')

const getStocks = async (search = null , sortBy, sortOrder = 'asc') => {
    const result = await inventoryModel.getStocks(search, sortBy, sortOrder);
    // {} is used in the map (({})) as it has object inside the array
    // () is used after => ({}) so we do not have to result anything from it else it will consider as mere piece of code
    const updatedResult = result.map(({ is_active, ...rest}) => ({
        ...rest,
        isActive: is_active,
    }));
    return updatedResult;
};

const getInventoryMetadata = async () => {
    const [items, brands, weights] = await Promise.all([
        inventoryModel.getEntity('items'),
        inventoryModel.getEntity('brands'),
        inventoryModel.getEntity('weights')
    ]);
    return {items, brands, weights};
};

const createStock = async (itemName, brandName, weightName, quantity, price) => {
    let item = await inventoryModel.getEntityByName('items', itemName);
    if(!item) item = await inventoryModel.createEntity('items', itemName);
    let brand = await inventoryModel.getEntityByName('brands', brandName);
    if(!brand) brand = await inventoryModel.createEntity('brands', brandName);
    let weight = await inventoryModel.getEntityByName('weights', weightName);
    if(!weight) weight = await inventoryModel.createEntity('weights', weightName);
    let entry = await inventoryModel.getStockByItemBrandWeight(item.id, brand.id, weight.id);
    if( entry ) throw new Error('Item Already Exists!');
    entry = await inventoryModel.createStock(item.id, brand.id, weight.id, quantity, price);
    return entry;
};

const updateStock = async (stockId, quantity, price) => {
    const stock = await inventoryModel.getStockById(stockId);
    if(!stock) throw new Error('Stock does not exists!');
    const { item_id, brand_id, weight_id, is_active, created_at, updated_at, ...rest } = await inventoryModel.updateStockById(stockId, quantity, price);
    return {
        ...rest,
        itemId: item_id,
        brandId: brand_id,
        weightId: weight_id,
        isActive: is_active,
        createdAt: created_at,
        updatedAt: updated_at,
    };
};

const getInventoryHierarchy = async () => {
    const result = await inventoryModel.getStocks();
    const temp = {};
    for (const stock of result) {
        if(!temp[stock.item]) {
            temp[stock.item] = {};
        }

        if(!temp[stock.item][stock.brand]) {
            temp[stock.item][stock.brand] = [];
        }
        temp[stock.item][stock.brand].push({
            inventoryId: stock.id,
            weight: stock.weight,
            quantity: stock.quantity,
            price: stock.price,
            isActive: stock.is_active,
        });
    }
    const hierarchy = Object.entries(temp).map(([item, brands]) => ({
        item,
        brands: Object.entries(brands).map(([brand, weights]) => ({
            brand,
            weights,
        })),
    }));
    return hierarchy;
};

module.exports = {
    getStocks,
    getInventoryMetadata,
    createStock,
    updateStock,
    getInventoryHierarchy,
};
