const express = require('express');

const itemsControllers = require('../controllers/items-controllers');

const router = express.Router();

router.get('/category', itemsControllers.getItemsByCategory);
router.post('/', itemsControllers.createItem);

module.exports = router;