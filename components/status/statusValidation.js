//Validation
const Joi = require('@hapi/joi');

//Ar Validation
exports.statusValidation = data => {
        const schema = Joi.object({
                status: Joi.string().required(),
        })
        return schema.validate(data)
}
