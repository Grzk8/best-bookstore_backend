const express = require('express');

const itemsControllers = require('../controllers/items-controllers');

const router = express.Router();

router.get('/category/:category', itemsControllers.getItemsByCategory);
router.get('/description/:id', itemsControllers.getItemById);
router.get('/newest', itemsControllers.getItemByNewest);
router.post('/search', itemsControllers.postSearch);
router.post('/', itemsControllers.createItem);

module.exports = router;