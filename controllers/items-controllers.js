const Item = require('../models/item');
const user = require('../models/user');

const getItemById = async (req, res, next) => {
    const itemId = req.params.id;
    let itemById;

    try {
        itemById = await Item.findById(itemId);
    } catch {
        const error = new Error('Items not found');
        error.code = 500;
        return next(error);
    }

    if (!itemById) {
        const error = new Error('No item found');
        error.code = 500;
        return next(error);
    }
    res.json({ item: itemById });
};

const getItemsByCategory = async (req, res, next) => {
    const category = req.params.category;
    let categoryResponse;

    try {
        categoryResponse = await Item.find({ category: category });
    } catch {
        const error = new Error('Items not found');
        error.code = 500;
        return next(error);
    }
    res.json({ category: categoryResponse });
};

const getItemByNewest = async (req, res, next) => {
    let newestResponse

    try {
        newestResponse = await Item.find().sort({ createdAt: -1 }).limit(10)
    } catch {
        const error = new Error('Items not found');
        error.code = 500;
        return next(error);
    }
    console.log(newestResponse);
    res.json({ newest: newestResponse });
};

const postSearch = async (req, res, next) => {
    const { searching } = req.body;
    let searchResponse;

    try {
        searchResponse = await Item.find({
            $or: [
                { title: { $regex: searching, $options: "i" } },
                { author: { $regex: searching, $options: "i" } }
            ]
        });
    } catch {
        const error = new Error('Items not found');
        error.code = 500;
        return next(error);
    }
    console.log(searchResponse);
    res.json({ search: searchResponse });
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

exports.getItemById = getItemById;
exports.createItem = createItem;
exports.getItemByNewest = getItemByNewest;
exports.getItemsByCategory = getItemsByCategory;
exports.postSearch = postSearch;