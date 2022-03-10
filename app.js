"use strict";
require("dotenv").config();

const express = require("express");
const res = require("express/lib/response");
const app = express();
const userModel = require("./Models/userModels")

app.use(express.static("public", {
    index: "index.html",
    extensions: ['html']
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '200kb'}));

app.post("/register", (req, res) =>{
    if(!req.body.userName || !req.body.userPassword
        || !req.body.userEmail || !req.body.userPhone){
        return res.sendStatus(400);
    }

    const {userName, userPassword, userEmail, userPhone} = req.body;
    
    userModel.createUser(userName, userPassword, userEmail, userPhone);
    res.sendStatus(201);
});

app.post("/createLocal", (req, res) =>{
    if(!req.body.name || !req.body.zip || !req.body.lat || !req.body.long){
        return res.sendStatus(400);
    }

    const {name, zip, lat, long} = req.body;
    userModel.createLocation(name, zip, lat, long);
    res.sendStatus(200);
});

module.exports = app;