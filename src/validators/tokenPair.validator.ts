import Joi from "joi";

export const authValidator = Joi.object({
    email: Joi.string().regex(/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/).messages({
        'string.pattern.base': 'Wrong email or password'
    }).required(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{5,20}.*$|^admin$/).messages({
        'string.pattern.base': 'Wrong email or password'
    })

})