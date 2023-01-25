const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Shema = mongoose.Schema;

const userSchema = new Shema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    street: { type: String, required: true },
    houseNr: { type: String, required: true },
    town: { type: String, required: true },
    postCode: { type: String, required: true },
    phoneNr: { type: String, required: true },
    orders: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Order' }]
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);