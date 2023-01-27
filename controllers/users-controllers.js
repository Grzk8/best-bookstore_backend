const User = require('../models/user');
const Order = require('../models/order');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Invalid data, check your data');
        error.code = 422;
        return next(error);
    }

    const { email, password, firstName, lastName, street, houseNr, postCode, town, phoneNr } = req.body;

    let userExist;
    console.log(req.body)
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

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch {
        const error = new Error('Could not create a user, try again');
        error.code = 500;
        return next(error);
    }
    const createUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        street,
        houseNr,
        postCode,
        town,
        phoneNr,
        orders: []
    });

    try {
        await createUser.save();
    } catch (err) {
        const error = new Error('Signing up failed');
        error.code = 500;
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({ userId: createUser.id, email: createUser.email }, 'qweasd123', { expiresIn: '1h' });
    } catch (err) {
        const error = new Error('Signing up failed');
        error.code = 500;
        return next(error);
    }

    res.status(201).json({ userId: createUser.id, email: createUser.email, token: token })
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    console.log(email, password)

    let userExist;
    try {
        userExist = await User.findOne({ email: email });
    } catch (err) {
        const error = new Error('Logging in faild');
        error.code = 500;
        return next(error);
    }

    if (!userExist) {
        const error = new Error('Invalid email or password');
        error.code = 401;
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, userExist.password);
    } catch (err) {
        const error = new Error('Logging in faild, try again ');
        error.code = 500;
        return next(error);
    }

    if (!isValidPassword) {
        const error = new Error('Invalid password');
        error.code = 401;
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({ userId: userExist.id, email: userExist.email }, 'qweasd123', { expiresIn: '1h' });
    } catch (err) {
        const error = new Error('Logging in failed');
        error.code = 500;
        return next(error);
    }

    res.json({ user: userExist.id, email: userExist.email, token });
};

const getUsersData = async (req, res, next) => {
    const userId = req.params.uid;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new Error('Fetching data failed');
        error.code = 500;
        return next(error);
    }

    if (!user) {
        const error = new Error('User not found');
        error.code = 500;
        return next(error);
    }

    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        street: user.street,
        houseNr: user.houseNr,
        postCode: user.postCode,
        town: user.town,
        phoneNr: user.phoneNr
    });
};

const updateUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Invalid data, check your data');
        error.code = 422;
        return next(error);
    }

    const { id, firstName, lastName, street, houseNr, postCode, town, phoneNr } = req.body;


    let user;
    console.log(req.body)
    try {
        user = await User.findById(id);
    } catch {
        const error = new Error('User already exist');
        error.code = 500;
        return next(error);
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.street = street;
    user.houseNr = houseNr;
    user.postCode = postCode;
    user.town = town;
    user.phoneNr = phoneNr


    try {
        await user.save();
    } catch (err) {
        const error = new Error('Signing up failed');
        error.code = 500;
        return next(error);
    }

    // let token;
    // try {
    //     token = jwt.sign({ userId: createUser.id, email: createUser.email }, 'qweasd123', { expiresIn: '1h' });
    // } catch (err) {
    //     const error = new Error('Signing up failed');
    //     error.code = 500;
    //     return next(error);
    // }

    res.status(201).json({ user })
};

const newOrder = async (req, res, next) => {
    const { date, books, price, creator } = req.body;

    const addOrder = new Order({
        date,
        books,
        price,
        creator
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError(
            'Creating order failed, please try again.',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await addOrder.save({ session: sess });
        user.orders.push(addOrder);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creating order failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ orders: addOrder });
};

const getUsersOrders = async (req, res, next) => {
    const userId = req.params.uid;

    let usersOrders;
    try {
        usersOrders = await User.findById(userId).populate('orders');
    } catch (err) {
        const error = new Error('Fetching orders failed');
        error.code = 500;
        return next(error);
    }

    if (!usersOrders || usersOrders.orders.length === 0) {
        const error = new Error('Orders not found');
        error.code = 500;
        return next(error);
    }

    res.json({
        orders: usersOrders.orders
    });
};


exports.signup = signup;
exports.login = login;
exports.getUsersData = getUsersData;
exports.updateUser = updateUser;
exports.newOrder = newOrder;
exports.getUsersOrders = getUsersOrders;