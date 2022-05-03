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
    userName: joi.string()
                 .min(3)
                 .token()
                 .lowercase()
                 .required(),
    
    userPassword: joi.string()
                 .min(6)
                 .required(),
    
    confirmPassword: joi.string()
                    .min(6)
                    .required()
                    .valid(joi.ref('userPassword')),
    
    userEmail: joi.string()
              .email()
              .required(),
    
    userDOB: joi.date()
            .required(),
    
    userPhone: joi.string()
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