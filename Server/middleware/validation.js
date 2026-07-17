const Joi = require('joi');

exports.signinSchema = Joi.object({
    name: Joi.string()
    .required()
    .min(5)
    .max(40),


    email: Joi.string()
    .required()
    .email({ tlds: { allow: ['com'] } }),


    password: Joi.string()
    .required()
    .min(8)
    .max(25)
    .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
    .message({
        'string.pattern.base':
        'Password must be at least 8 characters and contain one Capital case, Lower case and numbers'
    })
});


exports.signupSchema = Joi.object({
    email: Joi.string()
    .required()
    .email({ tlds: { allow: ['com'] } }),

    password: Joi.string()
    .required()
});


exports.acceptCodeSchma = Joi.object({
    email: Joi.string(),

    provideCode: Joi.number()
    .required()
});


exports.changePassword = Joi.object({
    newPassword: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
    .message({
        'string.pattern.base':
        'Password must be at least 8 characters and contain one Capital case, Lower case and numbers'
    })
});


exports.acceptFPCodeSchema = Joi.object({
    email: Joi.string()
    .required()
    .email({
        tlds: { allow: ['com']}
    }),

    provideCode: Joi.string()
    .required()
    .pattern(new RegExp('^[0-9]{5}$'))
    .message({
        'string.pattern.base': 
        'Verification code must be a 6-digit number.'
    })
});