const Joi = require('joi');

const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("",null),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required()
})

const reviewSchema = Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().min(1).max(5)
})

module.exports = {listingSchema,reviewSchema};
