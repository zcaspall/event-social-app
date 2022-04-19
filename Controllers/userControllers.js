"use strict";
const userModels = require("../Models/userModels");
const argon2 = require("argon2");

async function createNewUser(req, res){
    
    const {userName, userPassword, userEmail, userPhone} = req.body;

    if(!req.body.userName || !req.body.userPassword
        || !req.body.userEmail || !req.body.userPhone){
        return res.sendStatus(400);
    }
    else{
        await userModels.createUser(userName, userPassword, userEmail, userPhone);
        res.sendStatus(201);
    }
}

async function loginUser(req, res){
    if (!req.body.userName || !req.body.userPassword) {
        return res.sendStatus(400);
    }

    const {userName, userPassword} = req.body;

    const user = userModels.getUserByUsername(userName);

    if (!user) {
        return res.sendStatus(400);
    }

    const { userPasswordHash } = user;

    if (await argon2.verify(userPasswordHash, userPassword)) {
        res.sendStatus(200);
    } else { 
        res.sendStatus(400);
    }
}

function deleteUserByName(req, res){
    const { userName } = req.body;
    // make it so it sends an error when the username is not found
    if(!userModels.getUserByUsername(userName)){
        return res.sendStatus(404);
    }
    
    userModels.deleteUserByUsername(userName);
    res.sendStatus(200);
}

function uploadProfilePic(req, res){
    
}

module.exports = {
    createNewUser,
    loginUser,
    deleteUserByName,
    uploadProfilePic,
}