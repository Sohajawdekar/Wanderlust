const mongoose = require('mongoose');
const Joi= require("joi");
const ListingSchema=Joi.object({
    
       title: Joi.string().required(),
       image: Joi.object({
              url:Joi.string(),
              filename:Joi.string()

       }),
       description:Joi.string().required(),
       price:Joi.number().required().min(0),
       location:Joi.string().required(),
       country:Joi.string().required()
    
})

const reviewSchema=Joi.object({
       comment:Joi.string().required(),
       rating : Joi.number().required().min(0).max(5),
      
})
module.exports = { ListingSchema, reviewSchema };