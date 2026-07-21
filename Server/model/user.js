const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: [true, 'Password must be at aleast 8 characters.']
    }, 

    verified: {
        type: Boolean,
        default: false
    },

    verificationCode: {
        type: String,
        select: false
    },

    verificationCodeValidation: {
        type: String,
        select: false
    },

    forgotPasswordCode: {
        type: String,
        select: false
    },

    forgotPasswordCodeValidation: {
        type: Number,
        select: false
    }
});

exports.User = mongoose.model('User', userSchema, 'users');