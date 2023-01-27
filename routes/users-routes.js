const express = require('express');
const { check } = require("express-validator");

const usersControllers = require('../controllers/users-controllers');

const router = express.Router();

router.post('/login', usersControllers.login);
router.post('/signup', [
    check('email')
        .normalizeEmail()
        .isEmail(),
    check('password')
        .isLength({ min: 6 }),
    check('firstName')
        .not()
        .isEmpty(),
    check('lastName')
        .not()
        .isEmpty(),
    check('street')
        .not()
        .isEmpty(),
    check('houseNr')
        .not()
        .isEmpty(),
    check('town')
        .not()
        .isEmpty(),
    check('postCode')
        .not()
        .isEmpty(),
    check('phoneNr')
        .not()
        .isEmpty(),
], usersControllers.signup);
router.get('/userdata/:uid', usersControllers.getUsersData);
router.post('/updatedata', [
    check('firstName')
        .not()
        .isEmpty(),
    check('lastName')
        .not()
        .isEmpty(),
    check('street')
        .not()
        .isEmpty(),
    check('houseNr')
        .not()
        .isEmpty(),
    check('town')
        .not()
        .isEmpty(),
    check('postCode')
        .not()
        .isEmpty(),
    check('phoneNr')
        .not()
        .isEmpty(),
], usersControllers.updateUser);
router.post('/order', usersControllers.newOrder);
router.get('/order/:uid', usersControllers.getUsersOrders);

module.exports = router;