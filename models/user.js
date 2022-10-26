const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Shema = mongoose.Schema;

const userSchema = new Shema({
    login: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    street: { type: String, required: true },
    houseNr: { type: String, required: true },
    town: { type: String, required: true },
    postNr: { type: String, required: true },
    phoneNr: { type: String, required: true },
    orders: {
        items: [
            { type: mongoose.Types.ObjectId, required: true, ref: 'Item' }
        ]
    }
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);