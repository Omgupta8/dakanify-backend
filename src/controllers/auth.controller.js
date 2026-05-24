const { status: httpStatus } = require('http-status');
const authService = require('../services/auth.service');

const registerUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await authService.registerUser(username, password);
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

const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await authService.loginUser(username, password);
        return res.status(httpStatus.OK).json({
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

const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const result = await authService.updatePassword(req.user.userId, currentPassword, newPassword);
        return res.status(httpStatus.OK).json({
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

const getUser = async (req, res, next) => {
    try {
        const result = await authService.getUser(req.user.userId);
        return res.status(httpStatus.OK).json({
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

module.exports = {
    registerUser,
    loginUser,
    updatePassword,
    getUser,
};