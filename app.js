"use strict";
require("dotenv").config();
const isProduction = process.env.NODE_ENV === "production";

const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const express = require("express");
const multer = require("multer");
const app = express();

// Multer
const eventImages = multer({dest: 'public/images/eventImages/'});

const sessionConfig = {
    store: new RedisStore({ client: redis.createClient() }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "session",
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 8,
    }
};

app.use(session(sessionConfig));

// Load Controllers
const userController = require("./Controllers/userControllers");
const eventController = require("./Controllers/eventControllers");

// Load validators
const loginValidator = require("./Validators/loginValidator");
const registerValidator = require("./Validators/registerValidator");
const eventValidator = require("./Validators/eventValidator");
const reportValidator = require("./Validators/reportValidator");
const friendValidator = require("./Validators/friendValidator");
const { RedisClient } = require("redis");
const { func } = require("joi");
const { notFoundHandler, productionErrorHandler } = require("./utils/errorHandler");

app.set('view engine', 'ejs');

app.use(express.json({limit: '200kb'}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public", {
    index: "index.html",
    extensions: ['html', 'js', 'css', 'png', 'jpg', 'jpeg']
}));

// user endpoints
app.get("/", eventController.renderMain);
app.post("/register",registerValidator.validateRegisterBody, userController.createNewUser);
app.post("/login", loginValidator.validateLoginBody, userController.loginUser);
app.delete("/users/:userName", userController.deleteUserByName);
app.post("/friend", friendValidator.validateRequestBody, userController.sendFriendRequest);
app.post("/report", reportValidator.validateReportBody, userController.sendUserReport);
app.get("/accept/:userID", userController.acceptFriendRequest);

//event endpoints
app.post("/events", eventValidator.validateEventBody, eventImages.single('file'), eventController.createEvent);
app.get("/events", eventController.renderEventPage);
app.get("/events/:eventId", eventController.renderEvent);
app.post("/join/:eventId", eventController.joinEvent);

// 404 Handler
app.use(notFoundHandler);

// Production error handler
if (isProduction) {
    app.use(productionErrorHandler);
}

module.exports = app;