const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    admin: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;