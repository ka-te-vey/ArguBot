const { signinSchema, signupSchema } = require('../middleware/validation');
const jwt = require('jsonwebtoken');
const { User } = require('../model/user');
const { doHashValidation, doHash } = require('../utils/hashing');


exports.signin = async(req, res) => {
    const { email, password } = req.body;

    try {
        const { error } = signinSchema.validate({ email, password });
        if(error){
            return res.status(400).json({ success:false, message: error.message })
        }

        const existingUser = await User.findOne({ email }).select('+password')
        if(!existingUser){
            return res.status(401).json({ success:false, message: 'User already existed!' })
        }

        const isPasswordCorrect = await doHashValidation(password, existingUser.password);
        if(!isPasswordCorrect){
            return res.status(401).json({ success:false, message: 'Invalid credentials.' })
        }

        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified
        }, process.env.TOKEN_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.cookie('Authorization', 'Bearer ' + token, {
            expires: new Date(Date.now() + 8 + 360000),
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production'
        }) .json ({
            success: true,
            token,
            message: 'Logged in successfully!'
        });

    } catch (error) {
        return res.status(500).json({ success:false, message: error.message });
    }
};


exports.signup = async(req, res) => {
    const { name, email, password } = req.body;

    try {
        const { error } = signupSchema.validate({ name, email, password });
        if(error) {
            return res.status(400).json({ success:false, message: 'User already exists!' })
        }

        const hashedPassword = await doHash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({ success:true, message: 'User registered successfully!' });

    } catch (error) {
        return res.status(500).json({ success:false, message: error.message });
    }
};


exports.signout = async(req, res) => {
    res.clearCookie('Authorization').status(200).json({ success:true, message: 'Logged out successfully!' })
};