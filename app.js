"use strict";
require("dotenv").config();

const express = require("express");
const res = require("express/lib/response");
const app = express();
const userModel = require("./Models/userModels")

app.use(express.json());

app.post("/users", (req, res) =>{
    if(!req.body.userName || !req.body.userPassword){
        return res.sendStatus(400);
    }

    const {userName, userPassword} = req.body;
    
    userModel.addUser(userName, userPassword);
    res.sendStatus(201);
});
