const User = require('../models/user');

const signup = async (req, res, next) => {

    const { login, email, password, firstName, lastName, street, houseNr, postNr, town, phoneNr, orders } = req.body;
    let userExist;

    try {
        userExist = await User.findOne({ email: email});
    }catch{
        const error = new Error('User already exist');
        error.code = 500;
        return next(error);
    }

    if (userExist) {
        const error = new Error('User email exists');
        error.code = 422;
        return next(error);
    }

    const createUser = new User ({
        login,
        email,
        password,
        firstName,
        lastName,
        street,
        houseNr,
        postNr,
        town,
        phoneNr,
        orders
    });

    try{
        await createUser.save();
    }catch{
        const error = new Error('Signing up failed');
        error.code = 500;
        return next(error);
    }

    res.status(201).json({user: createUser})
};

exports.signup = signup;