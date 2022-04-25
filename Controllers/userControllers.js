"use strict";
const userModels = require("../Models/userModels");
const argon2 = require("argon2");
const multer = require("multer");

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

//Profile Pictures
const path = require("path");

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './profilePictures');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    },

    // fileFilter(req, file, cb){
    //     // ask saldivar for the session role
    //     if(!req.session /*&& req.session.role !== */){
    //         return cb(null, false);
    //     }
    //     if(file.mimetype.startsWith("image/")){
    //         return cb(null, true);
    //     }
    //     else{
    //         return cb(null, false);
    //     }
    // },
});

const upload = multer({ storage: fileStorage });

function uploadProfilePic(req, res){
    console.log(req.file);
    console.log(req.body);
    if(!req.file){
        return res.send(":,)");
    }
    res.send("File uploaded");
}
    

module.exports = {
    createNewUser,
    loginUser,
    deleteUserByName,
    uploadProfilePic,
    upload,
}