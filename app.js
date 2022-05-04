"use strict";
require("dotenv").config();

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

app.set('view engine', 'ejs');

app.use(express.json({limit: '200kb'}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public", {
    index: "index.html",
    extensions: ['html', 'js', 'css', 'png', 'jpg', 'jpeg']
}));

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/profilePictures");
    },
});

const profileStorage = multer({storage: fileStorage});

// user endpoints
app.post("/users/:userID/picture", profileStorage.single("picture"), userController.userProfilePicture)

app.post("/register", userController.createNewUser);
app.post("/login", userController.loginUser);
app.get("/users/:userID", userController.renderAccount);
app.get("/", eventController.renderMain);
app.post("/register",registerValidator.validateRegisterBody, catchAsyncErrors(userController.createNewUser));
app.post("/login", loginValidator.validateLoginBody, catchAsyncErrors(userController.loginUser));
app.delete("/users/:userName", userController.deleteUserByName);
app.post("/friend", friendValidator.validateRequestBody, userController.sendFriendRequest);
app.post("/report", reportValidator.validateReportBody, userController.sendUserReport);
app.get("/accept/:userID", userController.acceptFriendRequest);

//event endpoints
app.post("/events", eventValidator.validateEventBody, eventImages.single('file'), catchAsyncErrors(eventController.createEvent));
app.get("/events", eventController.renderEventPage);
app.get("/events/:eventId", eventController.renderEvent);
app.post("/join/:eventId", catchAsyncErrors(eventController.joinEvent));

module.exports = app;