const Joi = require('joi');

const validateOffer = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
        discountRange: Joi.array().items(Joi.number().min(0)).length(2).required(),
        isActive: Joi.boolean().default(true)
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid offer data",
            errors: error.details.map((err) => err.message) // Send detailed validation errors
        });
    }

    next();
};

module.exports = validateOffer;
