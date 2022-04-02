"use strict";
require("dotenv").config();

const argon2 = require("argon2");
const express = require("express");
const res = require("express/lib/response");
const app = express();
const userModel = require("./Models/userModels")

app.set('view engine', 'ejs');
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

app.post("/login", async (req, res) => {
    if (!req.body.userName || !req.body.userPassword) {
        return res.sendStatus(400);
    }

    const {userName, userPassword} = req.body;

    const user = userModel.getUserByUsername(userName);

    if (!user) {
        return res.sendStatus(400);
    }

    const { userPasswordHash } = user;

    if (await argon2.verify(passwordHash, userPassword)) {
        res.sendStatus(200);
    } else { 
        res.sendStatus(400);
    }
});

app.delete("/users/:userName", (req, res) => {
    const { userName } = req.params;

    userModel.deleteUserByUsername(userName);
    res.sendStatus(200);
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