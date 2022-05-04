"use strict";

const joi = require("joi");

const validateOpts = {
    abortEarly: false,
    stripUnknown: true,
    errors: {
        escapeHtml: true
    }
};

const eventSchema = joi.object({
    eventName: joi.string()
                  .min(3)
                  .required(),

    eventDate: joi.date()
                  .required(),

    eventLocation: joi.string()
                      .required(),
    
    eventDescription: joi.string()
        .min(3)
        .max(300),

    eventLocationData: joi.string()
        .required(),
}); 
    
function validateEventBody(req, res, next) {
    const { value, error } = eventSchema.validate(req.body, validateOpts);

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        
        return res.status(400).json({"errors": errorMessages});
    }
    
    req.body = value;
    
    next();
}

module.exports = {
    validateEventBody,
}