"use strict";
const userModels = require("../Models/userModels");
const argon2 = require("argon2");


async function createNewUser(req, res){
    
    const {userName, userPassword, userEmail, userPhone} = req.body;

    if(!req.body.userName || !req.body.userPassword
        || !req.body.userEmail || !req.body.userPhone){
        return res.sendStatus(400);
    } else {
        await userModels.createUser(userName, userPassword, userEmail, userPhone);
        res.redirect("/");
    }
}

async function loginUser(req, res){
    const {username, password} = req.body;
    const user = userModels.getUserByUsername(username);
    
    if (!user) {
        return res.sendStatus(400);
    }

    const { userPasswordHash, userID } = user;

    if (await argon2.verify(userPasswordHash, password)) {
        req.session.regenerate((err) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            
            req.session.user = {};
            req.session.user.userName = username;
            req.session.user.userID = userID;
            req.session.isLoggedIn = true;
            
            res.redirect("/");
        });
    } else { 
        return res.sendStatus(400);
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

async function userProfilePicture(req, res){
    const{user, isLoggedIn} = req.session;
    const{path, filename} = req.file;

    const userID = user.userID

    if(!isLoggedIn){
        return res.redirect("/login");
    }

    const imageID = filename;
    const imageOwned = user.userID;
    const pfpPath = path;

    try{
        await userModels.uploadImage(imageOwned, imageID, pfpPath)
    }
    catch(err){
        console.log(err);
    }

    userModels.getImage(userID);
    res.redirect("/users/:userID");
}

function renderAccount(req, res){
    const {user, isLoggedIn} = req.session;

    if(!user || !isLoggedIn){
        return res.status(404);
    }

    const image = userModels.getImage(user.userID);

    const accountOwner = userModels.getUserByID(user.userID);
    res.render("accountPage", {"user": accountOwner , "image": image});
}

function sendFriendRequest(req, res){
    if(!req.session.isLoggedIn)
        return res.redirect("/login");

    if(!req.body.friendName){
        return res.sendStatus(400);
    }

    const {friendName} = req.body;
    const friend = userModels.getUserByUsername(friendName);
    const friendID = friend.userID;
    const userID = req.session.user.userID;

    const success = userModels.requestFriend(userID, friendID);
    if (!success){
        return res.sendStatus(409);
    }

    res.sendStatus(200);
};

function sendUserReport(req, res){
    if(!req.session.isLoggedIn)
        return res.redirect("/login");

    if(!req.body.reportedName){
        return res.sendStatus(400);
    }
    const userName = req.session.user.userName.toLowerCase();

    const {reportedName} = req.body;
    
    const success = userModels.reportUser(userName, reportedName);
    if (!success){
        return res.sendStatus(409);
    }

    res.sendStatus(200);
};

function acceptFriendRequest (req, res){
    if(!req.session.isLoggedIn)
        return res.redirect("/login");

    if(!req.body.userName || !req.body.friendName){
        return res.sendStatus(400);
    }

    const {userName, friendName} = req.body; 
    userModels.acceptRequest(userName, friendName);

    res.sendStatus(200);
};

module.exports = {
    createNewUser,
    loginUser,
    deleteUserByName,
    renderAccount,
    userProfilePicture,
    sendFriendRequest,
    sendUserReport,
    acceptFriendRequest
}