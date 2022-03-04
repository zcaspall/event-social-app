"use strict";
require("dotenv").config();

const express = require("express");
const res = require("express/lib/response");
const app = express();
const userModel = require("./Models/userModels")

app.use(express.json());

app.post("/users", (req, res) =>{
    res.send("POST /users is under construction");
});
