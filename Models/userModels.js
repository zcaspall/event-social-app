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



const joinText = (
    "You've made an account on our Social App!\n\n"
);

const joinHTML = (
    "<h1 style=\"margin-bottom: 1rem;\">You've made an account on our Social App!</h1>"
);

const reportedText = (
    "You've been reported by another user.\n\nMight wanna be less of a garbage person at the next event you go to.\n"
);

const reportedHTML = (
    "<h1 style=\"margin-bottom: 1rem;\">You've been reported by another user.</h1>" +
  "<p>" +
    "Might wanna be less of a garbage person at the next event you go to." +
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

	
async function sendFriendReqEmail (userID, to) {
    const requestText = (
        "You have been sent a friend request.\n\n" +
        `Use this link to accept: http://${process.env.URL}/accept${userID}`
    );
    const requestHTML = (
        "<h1 style=\"margin-bottom: 1rem;\">You have been sent a friend request!</h1>" +
      "<p>" +
        `Click <a href="http://${process.env.URL}/accept/${userID}">here</a> to accept!` +
      "</p>"
    );
    try {
    const emailSent = await sendEmail(to, "You have a friend request!", requestText, requestHTML);
    } catch (err) {
        console.error(err);
    }
    if (!emailSent) {
        console.log("Email Failed to Send");
    }
};

async function sendJoinEmail (to) {
    try {
        const emailSent = await sendEmail(to, "You joined our site!", joinText, joinHTML);
    } catch (err) {
        console.error(err);
    }
    if (!emailSent) {
        console.log("Email Failed to Send");
    }
};

async function sendReportedEmail (to) {
    try {
    const emailSent = await sendEmail(to, "Someone didn't like you!", reportedText, reportedHTML);
    } catch (err) {
        console.error(err);
    }
    if (!emailSent) {
        console.log("Email Failed to Send");
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
    sendJoinEmail(userEmail);
};



function getUserByUsername (userName) {
    const sql = `SELECT * FROM Users WHERE userName = @userName`;

    const stmt = db.prepare(sql);
    const record = stmt.get({
        "userName": userName,
    });
    
    return record;
}

function getUserByID (userID) {
    const sql = `SELECT * FROM Users WHERE userID = @userID`;

    const stmt = db.prepare(sql);
    const record = stmt.get({
        "userID": userID,
    });
    
    return record;
}

function uploadImage(imageOwner, imageID, pfpPath){
    const sql = `INSERT INTO UserImages
                    (imageID, imageOwner, pfpPath)
                Values
                    (@imageID, @imageOwner, @pfpPath)`;
    
    const stmt = db.prepare(sql);
    try{
        stmt.run({
            "imageID": imageID,
            "imageOwner": imageOwner,
            "pfpPath": pfpPath,
        });
    }
    catch(err){
        console.log(err);
    }
};

function getImage(userID){
    const sql = `SELECT * FROM Users 
                 JOIN UserImages ON 
                 userID=imageOwner WHERE userID = @userID `;

    const stmt = db.prepare(sql);
    const record = stmt.get({
        "userID": userID
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

function reportUser(userName, reportedName){
    const user = getUserByUsername(userName);
    const reportedUser = getUserByUsername(reportedName);
    
    const userID = user.userID;
    const reportedID = reportedUser.userID;

    let success = false;

    if(!checkForStrikes(userID, reportedID)){
        const sql = `
        INSERT INTO ReportedUsers
            (userID, reportedID)
        VALUES
            (@userID, @reportedID)`;
        const stmt = db.prepare(sql); 
    
        try {
            stmt.run({userID, reportedID});
        } catch (err) {
            console.error(err);
            return success;
        }

        const sql2 = `
        UPDATE Users
        SET strikes = strikes + 1
        WHERE userID = @reportedID`;
        let stmt2 = db.prepare(sql2); 
        stmt2.run({reportedID});

        sendReportedEmail(reportedUser.userEmail);

        success = true;
    }

    return success;
};

function checkForStrikes(userID, reportedID){
    const sql = `
        SELECT *
        FROM ReportedUsers
        WHERE userID = @userID
        AND reportedID = @reportedID`;
    const stmt = db.prepare(sql);
    let previouslyStriked;
    try {
        previouslyStriked = stmt.get({
            "userID": userID, 
            "reportedID": reportedID
        });
    } catch (err) {
        console.error(err);
        return;
    }

    return previouslyStriked;
};

function requestFriend(userID, friendID){
    const friend = getUserByID(friendID);
    const user = getUserByID(userID);
    let success = true;

    const sql = `
    INSERT INTO Friends
        (userID, friendID)
    VALUES
        (@userID, @friendID)`;
    const stmt = db.prepare(sql);

    if (friend){   
        if (!checkFriend(userID, friendID)){
            try {
                stmt.run({
                    "userID": userID, 
                    "friendID": friendID
                });
            } catch (err) {
                console.error(err);
                return;
            }
            sendFriendReqEmail (user.userID, friend.userEmail);
        } else success = false;
    }
    return success;
};

function checkFriend(userID, friendID){
    let friendFirst = null;
    let userFirst;
    let alreadyRequested = false;
    const sql = `
        SELECT *
        FROM Friends
        WHERE userID = @userID
        AND friendID = @friendID`;
    
    const stmt = db.prepare(sql);
    try {
        userFirst = stmt.get({
            "userID": userID, 
            "friendID": friendID
        });
    } catch (err) {
        console.error(err);
        return;
    }
    
    try {
        friendFirst = stmt.get({
            "userID": friendID, 
            "friendID": userID
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

function acceptRequest(userID, friendID){
    const sql = `
        UPDATE Friends
        SET accepted = 1
        WHERE userID = @userID
        AND friendID = @friendID`;
    
    const stmt = db.prepare(sql);
    try {
        stmt.run({
            "userID": userID, 
            "friendID": friendID
        });
    } catch (err) {
        console.error(err);
        return;
    }
    
    try {
        stmt.run({
            "userID": friendID, 
            "friendID": userID
        });
    } catch (err) {
        console.error(err);
        return;
    }
};

function findFriendsByID(userID){
    const sql = `
        SELECT friendID AS friend
        FROM Friends
        WHERE userID = @userID
        UNION 
        SELECT userID AS friend
        FROM Friends
        WHERE friendID = @userID`;

    const stmt = db.prepare(sql);
    try {
        friends = stmt.all({
            "userID": userID
        });
    } catch (err) {
        console.error(err);
        return;
    }
    return friends;
}

module.exports = {
    createUser,
    getUserByUsername,
    deleteUserByUsername,
    getImage,
    getUserByID,
    deleteUserByUsername,
    reportUser,
    requestFriend,
    acceptRequest,
    uploadImage,
    findFriendsByID
};
