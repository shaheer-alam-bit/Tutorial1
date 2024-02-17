const bcrypt = require('bcrypt');
const Users = require('../models/user');
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/signUp', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email.match(/^\S+@\S+\.\S+$/)) return res.json({msg: 'Invalid Email Address format.'}); // Check the email format

        let user = await Users.findOne({email});
        if (user) return res.json({msg: 'USER EXISTS'});
        if ( password.length < 8 ||         // Check the length of the password
            !password.match(/[0-9]/) ||     // Check the presence of a number
            !password.match(/[a-z]/) ||     // Check the presence of a lowercase letter
            !password.match(/[A-Z]/)) return res.json({msg:"Your password must be at least 8 characters long, contain at least one number, and have a mixture of uppercase and lowercase letters."})
        
        await Users.create({...req.body, password: await bcrypt.hash(password, 5)});

        return res.json({msg: 'CREATED'});
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({msg: 'Validation Error:', error: error.message});
        }
        console.error(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email , password} = req.body;
        const user = await Users.findOne({email});
        if (!user) return res.json({msg: 'USER NOT FOUND'});

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) return res.json({msg: 'WRONG PASSWORD'});

        const token = jwt.sign({
            email,
            createdAt: new Date(),
            admin: user.admin,
        }, 'MY_SECRET', {expiresIn: '1d'});
        res.json({
            msg: 'LOGGED IN', token
        });
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;