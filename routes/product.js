const Users = require('../models/user');
const Product = require('../models/Product');
const express = require('express');
var router = express.Router();


router.post('/getByID', async (req, res) => {
    try {
        const product = await Product.findOne({ barcode_id: req.body.barcode_id }).populate('user','-password');
        if (!product) return res.json({ msg: "PRODUCT NOT FOUND" })
        res.json({ msg: "PRODUCT FOUND", data: product })
    } catch (error) {
        console.error(error);
    }
});

router.post('/getByName', async (req,res)=>{
    try{
        const {name} = req.body;
        const product = await Product.find({name: name})
        if(!product) return res.json({msg: "PRODUCT NOT FOUND"})

        res.json({msg: "PRODUCT FOUND", data: product})
    }catch(error){
        console.error(error)
    }
})

router.use((req, res, next) => {
    if (!req.user.admin) {
        return res.json({ msg: 'NOT ADMIN, NOT AUTHORIZED' });
    }
    else {
        next();
    }
})

router.post('/add', async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.json({ msg: 'USER NOT FOUND' });

        const product = await Product.findOne({ barcode_id: req.body.barcode_id })
        if (product) return res.json({ msg: `PRODUCT WITH ${req.body.barcode_id} ALREADY EXISTS` });

        if (req.body.price < 0) return res.json({msg: 'A Product cannot have negative value of price'});
        await Product.create({ ...req.body, user: user._id });
        return res.json({ msg: 'PRODUCT ADDED SUCCESSFULLY' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({msg: 'Validation Error:', error: error.message});
        }
        console.error(error);
    }
}
)

router.post('/delete', async (req, res) => {
    try {
        const { barcode_id } = req.body;
        const product = await Product.findOne({ barcode_id });
        if (!product) return res.json({ msg: `PRODUCT WITH ${barcode_id} NOT FOUND` });

        await Product.deleteOne({ barcode_id });
        return res.json({ msg: `PRODUCT WITH ${barcode_id} DELETED SUCCESSFULLY` });
    } catch (error) {
        console.error(error);
    }

})

router.post('/update',async (req,res)=>{
    try{
        const {barcode_id,quantity,name,price} = req.body;
        const product = await Product.findOne({barcode_id});
        if (!product) return res.json({ msg: `PRODUCT WITH ${barcode_id} NOT FOUND` });

        await Product.findOneAndUpdate({barcode_id: barcode_id},{ $set: { quantity: quantity , name:name, price:price }});
        return res.json({ msg: `PRODUCT WITH ${barcode_id} UPDATED SUCCESSFULLY` });
    }catch(error){
        console.error(error);
    }
})


module.exports = router