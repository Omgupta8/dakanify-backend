const customerModel = require('../models/customer.model.js');

const getCustomers = async (search = '', sortBy = 'created_at', sortOrder = 'desc') => {
    console.log(sortBy, sortOrder);
    
    const customers = await customerModel.getCustomers(search , sortBy, sortOrder);
    return customers;
};

const createCustomer = async (name , mobile = null) => {
    const customer = await customerModel.getCustomerByName(name);
    if(customer) {
        throw new Error('Customer Already Exists');
    }
    await customerModel.createCustomer(name, mobile);
    return 'Customer Created';
};

const getCustomerProfile = async ( userId ) => {
    const customer = await customerModel.getCustomerById(userId);
    if(!customer) {
        throw new Error('Customer does not exists');
    }
    return customer;
};

module.exports = { 
    getCustomers,
    createCustomer,
    getCustomerProfile,
};
