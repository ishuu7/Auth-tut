const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');



router.post('/register', async (req, res) => {

    // Lets validate first, 
    const { error } = registerValidation(req.body);

    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    // check if users already exist
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) {
        return res.status(400).send('Email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);



    // Creating a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        const savedUser = await user.save();
        res.status(200).json({ id: user._id });
        
    } catch (error) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {

    // Lets validate
    const { error } = loginValidation(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    // check if user's already exist
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        return res.status(400).send('Email not found, Please register!');
    }

    // Password is correct or not
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) {
        return res.status(400).send('Invalid Password!');
    }

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);


    // res.status(200).send('Logged In !')
});

module.exports = router;
