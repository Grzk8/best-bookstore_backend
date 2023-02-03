const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw Error('Authorization failed')
        }
        const decodedToken = jwt.verify(token, 'qweasd123');
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        const error = new Error('Authorization failed');
        error.code = 401;
        return next(error);
    }
};