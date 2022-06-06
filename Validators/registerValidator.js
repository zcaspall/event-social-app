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
    firstname: joi.string()
                  .required()
                  .messages({ "string.empty": "Firstname is required" }),
    
    lastname: joi.string()
                 .required()
                 .messages({ "string.empty": "Lastname is required" }),

    username: joi.string()
                 .min(3)
                 .token()
                 .required()
                 .messages({ 
                    "string.min": "Username must be at least 3 characters long",
                    "string.token": "Username must be alphanumeric",
                    "string.empty": "Username is required",
                }),
    
    password: joi.string()
                 .min(6)
                 .required()
                 .messages({ "string.min": "Password must be at least 6 characters long",
                             "string.empty": "Password is required"
                 }),
    
    confirmedPassword: joi.string()
                    .min(6)
                    .required()
                    .valid(joi.ref('password'))
                    .messages({ "any.only": "Passwords must match" }),
    
    email: joi.string()
              .email()
              .required()
              .messages({ "string.email": "Email must be valid",
                          "string.empty": "Email is required"
                    }),
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