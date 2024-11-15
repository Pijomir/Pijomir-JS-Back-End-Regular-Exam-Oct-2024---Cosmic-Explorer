const { User } = require('../models/User');
const bcrypt = require('bcrypt');

async function register(username, email, password) {
    const existing = await User.findOne({ username });

    if (existing) {
        throw new Error(`This username is already in use`);
    }

    const user = new User({
        username,
        email,
        password: await bcrypt.hash(password, 10)
    });

    try {
        await user.save();
    } catch (err) {
        if (err.code == 11000) {
            throw new Error('This email is already in use');
        }
    }

    return user;
}

async function login(username, password) {
    const user = await User.findOne({ username });

    if (!user) {
        throw new Error(`Incorrect username or password`);
    }

    const match = await bcrypt.compare(password, user.password);

    if(!match) {
        throw new Error(`Incorrect username or password`);
    }

    return user;
}

module.exports = {
    register,
    login,
};