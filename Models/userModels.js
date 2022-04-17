"use strict";
const db = require("./db");
const crypto = require("crypto");
const argon2 = require("argon2");	
const nodemailer = require("nodemailer");
const { env } = require("process");
 
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_ADDR,
        pass: process.env.EMAIL_PASS
    }
});

const requestText = (
    "You have been sent a friend request.\n\n" +
    //`Use this link to accept: ${process.env.URL}`
    `Use this link to accept: ${process.env.URL}/accept`
);

const requestHTML = (
    "<h1 style=\"margin-bottom: 1rem;\">You have been sent a friend request!</h1>" +
  "<p>" +
    `Click <a href="${process.env.URL}">here</a> to accept!` +
  "</p>"
);

/* Return's true if the email sent successfully and false otherwise */
async function sendEmail (recipient, subject, text, html) {
    
    const message = {
      from: process.env.EMAIL_ADDR,
      to: recipient,
      subject: subject,
      text: text,
      html: html
    };
    
    try {
      await transporter.sendMail(message);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
};

	
async function sendFriendReq (to) {
    const emailSent = await sendEmail(to, "You have a friend request!", requestText, requestHTML);
    if (emailSent) {
      console.log("Email Sent to " + to);
      console.log("\n");
    } else {
        console.log("Email Failed to Send");
        console.log("\n");
    }
};

async function createUser(userName, userPassword, userEmail, userPhone){
    const uuid = crypto.randomUUID();
    const hash = await argon2.hash(userPassword);

    const sql = `
        INSERT INTO users
            (userID, userName, userPasswordHash, userEmail, userPhone)
        VALUES
            (@userID, @userName, @userPasswordHash, @userEmail, @userPhone)
    `;

    const stmt = db.prepare(sql);

    try{
        stmt.run({
            "userID": uuid,
            "userName": userName.toLowerCase(),
            "userPasswordHash": hash,
            "userEmail": userEmail.toLowerCase(),
            "userPhone": userPhone,
        });
    }
    catch(err){
        console.error(err);
    }
};

function getUserByUsername (userName) {
    const sql = `SELECT * FROM Users WHERE userName = @userName`;

    const stmt = db.prepare(sql);
    const record = stmt.get({
        "userName": userName.toLowerCase()
    });

    return record;
}

function deleteUserByUsername (userName) {
    const sql = `DELETE FROM Users WHERE userName = @userName`;

    const stmt = db.prepare(sql);
    stmt.run({
        "userName": userName.toLowerCase()
    });
}

function addStrike(userName, strikedName){
    const userID = getID(userName);
    const strikedID = getID(strikedName);

    let success = false;

    if(!checkStrike(userID, strikedID)){
        const sql = `
        INSERT INTO StrikedUsers
            (userID, strikedID)
        VALUES
            (@userID, @strikedID)`;
        const stmt = db.prepare(sql); 
    
        try {
            stmt.run({userID, strikedID});
        } catch (err) {
            console.error(err);
            return success;
        }

        const sql2 = `
        UPDATE Users
        SET strikes = strikes + 1
        WHERE userID = @strikedID`;
        let stmt2 = db.prepare(sql2); 
        stmt2.run({strikedID});

        success = true;
    }

    return success;
};

function getID(userName){
    const sql = 
       `SELECT userID
        FROM Users 
        WHERE userName = @userName`;
    const stmt = db.prepare(sql);
    const {userID} = stmt.get({
            "userName": userName
        });
    return userID;
};

function getEmail(userID){
    const sql = `
        SELECT userEmail
        FROM Users 
        WHERE userID = @userID`;
    const stmt = db.prepare(sql);
    const {userEmail} = stmt.get({userID});
    return userEmail;
};

function checkStrike(userID, strikedID){
    const sql = `
        SELECT *
        FROM StrikedUsers
        WHERE userID = @userID
        AND strikedID = @strikedID`;
    const stmt = db.prepare(sql);
    let previouslyStriked;
    try {
        previouslyStriked = stmt.get({
            "userID": userID, 
            "strikedID": strikedID
        });
    } catch (err) {
        console.error(err);
        return;
    }

    return previouslyStriked;
};

function requestFriend(userName, friendName){
    let success = true;
    const sql = `
    INSERT INTO Friends
        (userName, friendName)
    VALUES
        (@userName, @friendName)`;
    const stmt = db.prepare(sql);
    const friendID = getID(friendName);
    if (friendID){   
        console.log("got userID");
        if (!checkFriend(userName, friendName)){
            console.log("not currently friends");
            try {
                stmt.run({
                    "userName": userName, 
                    "friendName": friendName
                });
            } catch (err) {
                console.error(err);
                return;
            }
            const friendEmail = getEmail(friendID);
            sendFriendReq (friendEmail);
            
        } else success = false;
    }
    return success;
};

function checkFriend(userName, friendName){
    let friendFirst = null;
    let userFirst;
    let alreadyRequested = false;
    const sql = `
        SELECT *
        FROM Friends
        WHERE userName = @userName
        AND friendName = @friendName`;
    
    const stmt = db.prepare(sql);
    try {
        userFirst = stmt.get({
            "userName": userName, 
            "friendName": friendName
        });
    } catch (err) {
        console.error(err);
        return;
    }
    
    try {
        friendFirst = stmt.get({
            "userName": friendName, 
            "friendName": userName
        });
    } catch (err) {
        console.error(err);
        return;
    }
    if(friendFirst || userFirst){
        alreadyRequested = true;
    }
    return alreadyRequested;
};

function acceptRequest(userName, friendName){
    const sql = `
        UPDATE Friends
        SET accepted = 1
        WHERE userName = @userName
        AND friendName = @friendName`;
    
    const stmt = db.prepare(sql);
    try {
        stmt.run({
            "userName": userName, 
            "friendName": friendName
        });
    } catch (err) {
        console.error(err);
        return;
    }
    
    try {
        stmt.run({
            "userName": friendName, 
            "friendName": userName
        });
    } catch (err) {
        console.error(err);
        return;
    }
};

module.exports = {
    createUser,
    getUserByUsername,
    deleteUserByUsername,
    addStrike,
    requestFriend,
    acceptRequest
}