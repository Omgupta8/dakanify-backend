const config = require('../config/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('../models/auth.model');

const saltRounds = 10;

const registerUser = async (username, password) => {
    const existingUser = await authModel.getUserByUsername(username);
    if (existingUser) {
        throw new Error('Username already exists');
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = await authModel.createUser(username, passwordHash);

    return {
        user: {
            id: user.id,
            username: user.username,
        }
    };
};

const loginUser = async (username, password) => {
    const user = await authModel.getUserByUsername(username);
    if (!user) {
        await bcrypt.compare(password, '$2b$10$dummyhashfortimingXXXXXXXXXXXXXXXXXXXX');
        throw new Error('Invalid name or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw new Error('Invalid name or password');
    }

    const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
        },
        config.jwt.jwtSecret,
        {
          expiresIn: config.jwt.jwtExpireTime,
          algorithm: 'HS256',
        }
    );

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
        }
    };
};

const updatePassword = async (userId, currentPassword, newPassword) => {
    const user = await authModel.getUserByUserId(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
    }

    if (currentPassword === newPassword) {
        throw new Error('New password must be different from current password');
    }

    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    const updatedUser = await authModel.updateUserPassword(userId, passwordHash);

    return {
        user: {
            id: updatedUser.id,
            username: updatedUser.username,
        }
    };
};

const getUser = async (userId) => {
    const user = await authModel.getUserByUserId(userId);
    if (!user) {
        throw new Error('User not found');
    }

    return {
        user: {
            id: user.id,
            username: user.username,
        }
    };
};

module.exports = {
    registerUser,
    loginUser,
    updatePassword,
    getUser,
};