"use strict";
require("dotenv").config();

const argon2 = require("argon2");
const express = require("express");
const res = require("express/lib/response");
const app = express();

const userController = require("./Controllers/userControllers");
const eventController = require("./Controllers/eventControllers");

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

app.post("/profile", 
  userController.upload.single("profilePictu"),  // The multer middleware will attach the `file` object to the `req` object
  userController.uploadProfilePic); // Now your route handler can use it

app.delete("/users/:userName", userController.deleteUserByName);

//event endpoints
app.post("/events", eventController.createEvent);
app.get("/events", eventController.getSearchResultsByKeyword);


module.exports = app;