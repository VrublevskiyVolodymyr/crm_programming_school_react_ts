import Joi from "joi";


export const managerValidator = Joi.object({
    email: Joi.string().regex(/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/).messages({
        'string.pattern.base': 'Email must be in a valid format and contain "@" and a domain (e.g., example@example.com)'
    }).required(),
    name: Joi.string()
        .max(20)
        .regex(/^[a-zA-Zа-яА-ЯЇЁіІё]+$/)
        .messages({
            'string.pattern.base': 'The name should only contain letters',
            'string.max': 'The name can have a maximum of 20 characters'
        }).required(),
    surname: Joi.string()
        .max(20)
        .regex(/^[a-zA-Zа-яА-ЯЇЁіІё]+$/)
        .messages({
            'string.pattern.base': 'The surname should only contain letters',
            'string.max': 'The surname can have a maximum of 20 characters'
        }).required(),
})
