const mongoose = require('mongoose');

const Shema = mongoose.Schema;

const itemSchema = new Shema({
    type: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    salePrice: { type: String, require: false }
});

module.exports = mongoose.model('Item', itemSchema);