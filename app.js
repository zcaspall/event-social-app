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

app.post("/strike", (req, res) =>{
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


module.exports = app;