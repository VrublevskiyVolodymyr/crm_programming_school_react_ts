import Joi from "joi";

export const passwordValidator = Joi.object({
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/)
        .min(8)
        .max(20)
        .messages({
            'string.pattern.base': 'The password must contain one lowercase letter, one uppercase letter, one number and one special character (@#$%^&+=!)',
            'string.min': 'Min 8 char',
            'string.max': 'Max 20 char'
        }).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords must match',
    }),
})