const knex = require('../database/index');

const getEntity = async (table) => {
    const entity = await knex(table).select('*').orderBy('name', 'asc');
    return entity;
};

const getEntityByName = async (table , name) => {
    const entity = await knex(table).where('name', name).first();
    return entity || null;
};

const createEntity = async (table, name) => {
    const [entity] = await knex(table).insert({
        name,
        is_active: true,
    }).returning('*');
    return entity;
};

const getStocks = async (search, sortBy, sortOrder) => {
    const query = 
        knex
          .from('inventory')
          .leftJoin('items', 'inventory.item_id', 'items.id')
          .leftJoin('brands', 'inventory.brand_id', 'brands.id')
          .leftJoin('weights', 'inventory.weight_id', 'weights.id');
    
    if (search) {
        query.whereILike('items.name', `%${search}%`)
            .orWhereILike('brands.name', `%${search}%`)
            .orWhereILike('weights.name', `%${search}%`);
    }
    
    if(sortBy) {
        query.orderBy([
            {column : sortBy, order: sortOrder},
            {column : 'items.name', order: sortOrder },
            {column : 'brands.name', order: sortOrder },
            {column : 'weights.name', order: sortOrder }
        ]);
    } else {
        query.orderBy([
            {column : 'items.name', order: sortOrder },
            {column : 'brands.name', order: sortOrder },
            {column : 'weights.name', order: sortOrder }
        ]);
    }

    const result = await query.select('inventory.id', 'items.name as item', 'brands.name as brand', 'weights.name as weight', 'inventory.quantity', 'inventory.price', 'inventory.is_active')
    
    return result;
};

const getStockByItemBrandWeight = async (itemId, brandId, weightId) => { 
    const stock = await knex('inventory').where('item_id', itemId).andWhere('brand_id', brandId).andWhere('weight_id', weightId).first();
    return stock || null;
};

const createStock = async (itemId, brandId, weightId, quantity, price) => {
    const stock = await knex('inventory').insert({
        item_id: itemId,
        brand_id: brandId,
        weight_id: weightId,
        quantity,
        price
    }).returning('*');
    return stock;
};

const getStockById = async (stockId) => {
    const stock = await knex('inventory').where('id', stockId).first();
    return stock || null;
};

const updateStockById = async (stockId, quantity, price) => {
    const [updatedStock] = await knex('inventory').where('id', stockId).update({
        quantity,
        price
    }).returning('*');
    return updatedStock;
};

module.exports = {
    getEntity,
    getEntityByName,
    createEntity,
    getStocks,
    getStockByItemBrandWeight,
    createStock,
    getStockById,
    updateStockById,
};
