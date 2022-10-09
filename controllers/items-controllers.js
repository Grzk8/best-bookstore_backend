const Item = require('../models/item');

const getItemsByCategory = async (req, res, next) => {
    const category = req.body;
    let categoryResponse;

    try {
        categoryResponse = await Item.find({ category: category.category });
    } catch {
        const error = new Error('Items not found');
        error.code = 500;
        return next(error);
    }
    res.json({ category: categoryResponse });
};

const createItem = async (req, res, next) => {
    const { type, category, title, author, description, price, image } = req.body;

    const newItem = new Item({
        type,
        category,
        title,
        author,
        description,
        price,
        image
    });

    try {
        await newItem.save();
    } catch (err) {
        const error = new Error('Adding item failed');
        error.code = 500;
        return next(error);
    }

    res.status(201).json({ item: newItem });
};

exports.createItem = createItem;
exports.getItemsByCategory = getItemsByCategory;