//Validation
const Joi = require('@hapi/joi');

//Ar Validation
exports.arValidation = data => {
    const schema = Joi.object({
        title: Joi.string().required(),
        category: Joi.array(),
        description: Joi.string(),
        priority: Joi.string().allow('', null),
        passcode: Joi.string(),
        commerce_title: Joi.string().allow('', null),
        commerce_description: Joi.string().allow('', null),
    }).options({ allowUnknown: true })

    return schema.validate(data)
}
