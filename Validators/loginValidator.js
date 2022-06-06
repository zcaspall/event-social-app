"use strict";

const joi = require("joi");

const validateOpts ={
    abortEarly : false,
    stripUnknown: true,
    errors: {
        escapeHtml: true
    }
};

const loginSchema = joi.object({
    username: joi.string()
                 .required()
                 .messages({ "string.empty": "Username is required" }),
    
    password: joi.string()
                 .required()
                 .messages({ "string.empty": "Password is required" }),
});

function validateLoginBody (req, res, next) {

    // validate data
    const {value, error} = loginSchema.validate(req.body, validateOpts);

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
    validateLoginBody,
}