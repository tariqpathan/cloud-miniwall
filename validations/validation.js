const Joi = require('joi')
const joi = require('joi')

const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username:joi.string().required().min(5).max(256),
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024),

    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        password:joi.string().required().min(6).max(1024)
    }).keys({
        // allows users to login via email or username
        username: Joi.string().min(5),
        email: Joi.string().min(6)
    }).or('username', 'email');
    return schemaValidation.validate(data)
}

const postValidation = (data) => {
    const schemaValidation = joi.object({
        post_title:joi.string().required().min(5).max(128),
        post_description:joi.string().required().min(5).max(4096),
    })
    return schemaValidation.validate(data)
}

const commentValidation = (data) => {
    const schemaValidation = joi.object({
        comment_description:joi.string().required().min(5).max(4096),
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.postValidation = postValidation
module.exports.commentValidation = commentValidation
