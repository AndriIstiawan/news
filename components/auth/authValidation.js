//Validation
const Joi = require('@hapi/joi');

//Register Validation
exports.registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string().required().min(5).regex(/^\S+$/),
        email: Joi.string().email().required().min(5),
        password: Joi.string().required().min(5)
    })
    return schema.validate(data)
}
