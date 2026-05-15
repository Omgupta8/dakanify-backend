const customerModel = require('../models/customer.model.js');

const createCustomer = async (name , mobile = null) => {
    const customer = await customerModel.getCustomerByName(name);
    if(customer) {
        throw new Error('Customer Already Exists');
    }
    await customerModel.createCustomer(name, mobile);
    return 'Customer Created';
};

module.exports = { 
    createCustomer,
};
