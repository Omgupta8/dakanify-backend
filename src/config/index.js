module.exports = {
    environment: process.env.NODE_ENV,
    server: {
        port: parseInt(process.env.SERVER_PORT, 10),
    },
    jwt: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpireTime: process.env.JWT_EXPIRATION_TIME,
    }
};
