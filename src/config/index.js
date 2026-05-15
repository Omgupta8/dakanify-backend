module.exports = {
    environment: process.env.NODE_ENV,
    server: {
        port: parseInt(process.env.SERVER_PORT, 10),
    }
};
