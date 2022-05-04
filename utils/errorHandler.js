"use strict";

const crypto = require("crypto");

function notFoundHandler (req, res) {
    res.status(404).render("error", {
        "n": crypto.randomInt(1, 5),
        "status": 404,
        "message": `Couldn't find ${req.path}`,
        "gifDirectory": "notFoundGifs",
        "title": "Not Found",
    });
};

function productionErrorHandler (err, req, res, next) {
    res.status(500).render("error", {
        "n": crypto.randomInt(1, 8),
        "status": 500,
        "message": `Awww Beanz, we're sorry. Something went wrong.`,
        "gifDirectory": "ErrorGifs",
        "title": "The beanz are burning!",
    });
};

function catchAsyncErrors (fn) {
    return function(req, res, next) {
        return fn(req, res, next).catch(next);
    }
}

module.exports = {
    notFoundHandler,
    productionErrorHandler,
    catchAsyncErrors,
};