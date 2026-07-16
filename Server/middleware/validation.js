const Joi = require('Joi');

exports.signinSchema = Joi.object({
    name: Joi.string()
    .min(5)
    .max(40)
    .required(),


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
