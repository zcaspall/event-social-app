"use strict";
require("dotenv").config();

const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const express = require("express");
const app = express();

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

app.use(express.static("public", {index: "index.html", extensions: ["html"]}));

app.use(express.urlencoded({extended: false}));

// Load Controllers
const userController = require("./Controllers/userControllers");
const eventController = require("./Controllers/eventControllers");

// Load validators
const { RedisClient } = require("redis");

app.set('view engine', 'ejs');
app.use(express.static("public", {
    index: "index.html",
    extensions: ['html']
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '200kb'}));

// user endpoints
app.post("/register", userController.createNewUser);
app.post("/login", userController.loginUser);
app.delete("/users/:userName", userController.deleteUserByName);

app.post("/makeEvent", eventController.createEvent);
app.get("/getEvent", eventController.getSearchResultsByKeyword);

module.exports = app;