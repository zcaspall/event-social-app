"use strict";
const db = require("./db");
const crypto = require("crypto");
const argon2 = require("argon2");

async function createUser(userName, userPassword, userEmail, userPhone){
    const uuid = crypto.randomUUID();
    const hash = await argon2.hash(userPassword);

    const sql = `
        INSERT INTO users
            (userId, userName, userPasswordHash, userEmail, userPhone)
        VALUES
            (@userID, @userName, @userPasswordHash, @userEmail, @userPhone)
    `;

    const stmt = db.prepare(sql);

    try{
        stmt.run({
            "userID": uuid,
            "userName": userName,
            "userPasswordHash": hash,
            "userEmail": userEmail,
            "userPhone": userPhone,
        });
    }
    catch(err){
        console.error(err);
    }
};

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
}

function getID(userName){
    const sql = `
        SELECT userID
        FROM Users 
        WHERE userName = @userName`;
    const stmt = db.prepare(sql);
    const {userID} = stmt.get({userName});

    return userID;
}

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
}

module.exports.createUser = createUser;
module.exports.addStrike = addStrike;