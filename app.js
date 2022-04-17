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
app.delete("/users/:userName", userController.deleteUserByName);

//event endpoints
app.post("/events", eventController.createEvent);
app.get("/events", eventController.getByKeyword);

app.post("/report", (req, res) =>{
    if(!req.body.userName || !req.body.strikedName){
        return res.sendStatus(400);
    }

    const {userName, strikedName} = req.body;
    
    const success = userModel.addStrike(userName, strikedName);
    if (!success){
        return res.sendStatus(409);
    }

    res.sendStatus(200);
});

app.post("/friend", (req, res) =>{
    if(!req.body.userName || !req.body.friendName){
        return res.sendStatus(400);
    }

    const {userName, friendName} = req.body;
    
    const success = userModel.requestFriend(userName, friendName);
    if (!success){
        return res.sendStatus(409);
    }

    res.sendStatus(200);
});

app.post("/accept", (req, res) =>{
    if(!req.body.userName || !req.body.friendName){
        return res.sendStatus(400);
    }

    const {userName, friendName} = req.body; 
    userModel.acceptRequest(userName, friendName);

    res.sendStatus(200);
});


module.exports = app;