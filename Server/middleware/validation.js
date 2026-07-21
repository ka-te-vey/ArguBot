const Joi = require('joi');

exports.signinSchema = Joi.object({
    email: Joi.string()
    .required()
    .email({ tlds: { allow: ['com'] } }),


    password: Joi.string()
    .required()
});


exports.signupSchema = Joi.object({
    name: Joi.string()
    .required()
    .min(5)
    .max(30),

    email: Joi.string()
    .required()
    .email({ tlds: { allow: ['com'] } }),

    password: Joi.string()
    .required()
    .min(8)
    .max(20)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,25}$'))
    .message({
        'string.pattern.base':
        'Password must be at least 8 characters and contain one Capital case, Lower case and numbers'
    })
});


exports.acceptCodeSchema = Joi.object({
    email: Joi.string()
    .required(),

    provideCode: Joi.number()
    .required()
});


exports.changePassword = Joi.object({
    newPassword: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,25}$'))
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