const Joi = require('joi')

const createUserValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(100).required()
    })
    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            success: false,
            message:"Email or password is invalid"
        })
    }
    next()
}

const loginUserValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(100).required()
    })
    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            success: false,
            message:"Email or password is invalid"
        })
    }
    next()
}


module.exports = { createUserValidation,loginUserValidation }