"use strict";

const joi = require("joi");

const validateOpts ={
    abortEarly : false,
    stripUnknown: true,
    errors: {
        escapeHtml: true
    }
};

const registerSchema = joi.object({
    username: joi.string()
                 .min(3)
                 .token()
                 .lowercase()
                 .required(),
    
    password: joi.string()
                 .min(6)
                 .required(),
    
    email: joi.string()
              .email()
              .required(),
    
    phone: joi.string()
              .length(10)
              .pattern(/^[0-9]+$/)
              .required(),
});

function validateRegisterBody (req, res, next) {

    // validate data
    const {value, error} = registerSchema.validate(req.body, validateOpts);

    // check for errors
    if (error){
        // get error messages
        const errorMessages = error.details.map(detail => detail.message);
        // respond with errors
        return res.status(400).json({"errors": errorMessages});
    }

    // overwrite with valid data
    req.body = value;

    // pass control to the next function
    next();
}

module.exports = {
    validateRegisterBody,
}