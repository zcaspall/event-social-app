"use strict";

const joi = require("joi");

const validateOpts ={
    abortEarly : false,
    stripUnknown: true,
    errors: {
        escapeHtml: true
    }
};

const reportSchema = joi.object({
    reportedName: joi.string()
                 .min(3)
                 .token()
                 .lowercase()
                 .required(),
});

function validateReportBody (req, res, next) {

    const {value, error} = reportSchema.validate(req.body, validateOpts);

    if (error){
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({"errors": errorMessages});
    }

    req.body = value;
    next();
}

module.exports = {
    validateReportBody,
}