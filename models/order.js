const mongoose = require('mongoose');

const Shema = mongoose.Schema;

const orderSchema = new Shema({
    date: { type: Date, required: true },
    books: { type: String, required: true },
    price: { type: Number, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Order', orderSchema);