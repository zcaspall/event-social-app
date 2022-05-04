"use strict";

const joi = require("joi");

const validateOpts ={
    abortEarly : false,
    stripUnknown: true,
    errors: {
        escapeHtml: true
    }
};

const friendSchema = joi.object({
    friendName: joi.string()
                 .min(3)
                 .token()
                 .lowercase()
                 .required(),
});

function validateRequestBody (req, res, next) {

    const {value, error} = friendSchema.validate(req.body, validateOpts);

    if (error){
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({"errors": errorMessages});
    }

    req.body = value;
    next();
}

module.exports = {
    validateRequestBody,
}