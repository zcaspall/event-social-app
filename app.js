"use strict";
require("dotenv").config();

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

const multer = require("multer");

const profileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, "./public/profilePictures");
      },
      filename: (req, file, cb) => {
          cb(null, Date.now() + "--" + file.originalname);
      },
});

const upload = multer({ storage: profileStorage });

app.post("/users/:userID/picture", upload.single("picture"), (req, res) => {
  console.log(req.file);
  res.send("File uploaded");
});

app.post("/register", userController.createNewUser);
app.post("/login", userController.loginUser);

app.get("/users/:userID", userController.renderAccount);
app.delete("/users/:userName", userController.deleteUserByName);

//event endpoints
app.post("/events", eventController.createEvent);
app.get("/events", eventController.getSearchResultsByKeyword);


module.exports = app;