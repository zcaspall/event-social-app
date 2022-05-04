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
    if(!userModels.getUserByUsername(userName)){
        return res.sendStatus(404);
    }
    
    userModels.deleteUserByUsername(userName);
    res.sendStatus(200);
}

function userProfilePicture(req, res){
    const{userID} = req.body.userID;

    if(!userModels.getImage(userID)){
        return res.sendStatus(404);
    }

    userModels.getImage(userID);
    res.sendStatus(200);
}

function renderAccount(req, res){
    const user = userModel.getUserByID(req.params.userID);

    if(!user){
        res.status(404);
    }

    res.render("accountPage", {"user": user})
}

module.exports = {
    createNewUser,
    loginUser,
    deleteUserByName,
    renderAccount,
    userProfilePicture,
}