const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    barcode_id: {type: String, required: true},
    name: {type: String, required: true},
    cateogry: String,
    MFG_date: Date,
    EXP_date: Date,
    price: {type: Number, required: true},
    quantity: Number,
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'Users' },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;