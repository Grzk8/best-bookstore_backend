const User = require('../models/user');
const { validationResult } = require('express-validator');

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Invalid data, check your data');
        error.code = 422;
        return next(error);
    }

    const { email, password, firstName, lastName, street, houseNr, postCode, town, phoneNr, orders } = req.body;
    let userExist;

    try {
        userExist = await User.findOne({ email: email });
    } catch {
        const error = new Error('User already exist');
        error.code = 500;
        return next(error);
    }

    if (userExist) {
        const error = new Error('User email exists');
        error.code = 422;
        return next(error);
    }

    const createUser = new User({
        email,
        password,
        firstName,
        lastName,
        street,
        houseNr,
        postCode,
        town,
        phoneNr,
        orders
    });

    try {
        await createUser.save();
    } catch {
        const error = new Error('Signing up failed');
        error.code = 500;
        return next(error);
    }

    res.status(201).json({ user: createUser })
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let userExist;
    try {
        userExist = await User.findOne({ email: email });
    } catch (err) {
        const error = new Error('Logging in faild');
        error.code = 500;
        return next(error);
    }

    if (!userExist || userExist.password !== password) {
        const error = new Error('Invalid email or password');
        error.code = 401;
        return next(error);
    }
    res.json({ user: userExist });
};

exports.signup = signup;
exports.login = login;