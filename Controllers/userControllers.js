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
    const {userName, userPassword} = req.body;

    const user = userModels.getUserByUsername(userName);

    if (!user) {
        return res.sendStatus(400);
    }

    const { userPasswordHash, userID } = user;

    if (await argon2.verify(userPasswordHash, userPassword)) {
        req.session.regenerate((err) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            
            req.session.user = {};
            req.session.user.userName = userName;
            req.session.user.userID = userID;
            req.session.isLoggedIn = true;
            
            res.sendStatus(200);
        });
    } else { 
        return res.sendStatus(400);
    }
}

function deleteUserByName(req, res){
    const { userName } = req.params;
    // make it so it sends an error when the username is not found
    
    userModels.deleteUserByUsername(userName);
    res.sendStatus(200);
}

module.exports = {
    createNewUser,
    loginUser,
    deleteUserByName
}