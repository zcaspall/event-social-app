"use strict";
const db = require("./db");
const crypto = require("crypto");
const argon2 = require("argon2");
const { env } = require("process");

async function createUser(firstname, lastname, username, email, password) {
    const uuid = crypto.randomUUID();
    const hash = await argon2.hash(password);

    const sql = `
        INSERT INTO users
            (userId, firstname, lastname, email, username, passwordHash)
        VALUES
            (@userId, @firstname, @lastname, @email, @username, @passwordHash)
    `;

    const stmt = db.prepare(sql);

    try{
        stmt.run({
            userId: uuid,
            firstname,
            lastname,
            email,
            username,
            passwordHash: hash
        });
    }
    catch(err){
        console.error(err);
    }
    sendJoinEmail(email);
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
    getUserByID,
    deleteUserByUsername,
    reportUser,
    requestFriend,
    acceptRequest,
    findFriendsByID
}