"use strict";
require("dotenv").config();

const argon2 = require("argon2");
const express = require("express");
const res = require("express/lib/response");
const app = express();

const userController = require("./Controllers/userControllers");
const eventController = require("./Controllers/eventControllers");

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
app.get("/getEvent", eventController.getByKeyword);

module.exports = app;