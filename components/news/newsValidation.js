//Validation
const Joi = require('@hapi/joi');

//Ar Validation
exports.newsValidation = data => {
        const schema = Joi.object({
                title: Joi.string().required(),
                body: Joi.string().required(),
                status: Joi.string().required(),
        })
        return schema.validate(data)
}
